import { Router } from 'express';
import { query, pool } from '../config/db';
import { authRequired, roleRequired } from '../middleware/auth';
import { emitOrder, emitToUser, emitInventoryAlert } from '../lib/realtime';
import { sendEmail } from '../lib/email';
import { resolveBucaramangaCoords } from '../lib/bucaramangaGeo';

const router = Router();
router.use(authRequired);

const STATUS_TRANSITIONS: Record<string, string[]> = {
  nuevo: ['confirmado', 'cancelado'],
  confirmado: ['preparando', 'cancelado'],
  preparando: ['despachado', 'cancelado'],
  despachado: ['en_camino'],
  en_camino: ['entregado'],
  entregado: [],
  cancelado: [],
};

function orderSelect() {
  return `SELECT o.*, r.name AS restaurant_name, s.name AS supplier_name,
                 COALESCE(s.email, '') AS supplier_email, COALESCE(u.email, '') AS restaurant_email
          FROM orders o
          JOIN restaurants r ON r.id = o.restaurant_id
          JOIN suppliers s ON s.id = o.supplier_id
          LEFT JOIN users u ON u.id = o.created_by`;
}

function orderAccessWhere(user: {
  role: string;
  supplier_id: number | null;
  restaurant_id: number | null;
}) {
  if (user.role === 'proveedor_admin') {
    return { clause: ' AND o.supplier_id = $1', params: [user.supplier_id] as unknown[] };
  }
  if (user.role === 'domiciliario') {
    return { clause: '', params: [] as unknown[] };
  }
  if (user.restaurant_id) {
    return { clause: ' AND o.restaurant_id = $1', params: [user.restaurant_id] as unknown[] };
  }
  return { clause: '', params: [] as unknown[] };
}

// GET /api/orders - Listar órdenes (para restaurante o proveedor)
router.get('/', async (req, res, next) => {
  try {
    const user = req.user!;
    const params: unknown[] = [];
    let sql = `${orderSelect()} WHERE 1=1`;
    
    if (req.query.status) {
      params.push(req.query.status);
      sql += ` AND o.status = $${params.length}`;
    }
    if (req.query.supplier_id) {
      params.push(req.query.supplier_id);
      sql += ` AND o.supplier_id = $${params.length}`;
    }
    const access = orderAccessWhere(user);
    sql += access.clause;
    params.push(...access.params);

    const result = await query(`${sql} ORDER BY o.created_at DESC LIMIT 200`, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/orders - Procesar Carrito de Compras y Generar Órden
router.post('/', roleRequired('gerente', 'empleado', 'admin'), async (req, res, next) => {
  try {
    const user = req.user!;
    const { supplier_id, branch_id, items, notes, delivery_address, requested_delivery_date } = req.body;
    if (!supplier_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'supplier_id e items del carrito son requeridos' });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const code = `ORDER-${Date.now().toString(36).toUpperCase()}`;
      const inserted = await client.query(
        `INSERT INTO orders (order_code, restaurant_id, branch_id, supplier_id, status, notes, delivery_address, requested_delivery_date, created_by)
         VALUES ($1, $2, $3, $4, 'nuevo', $5, $6, $7, $8) RETURNING id`,
        [code, user.restaurant_id, branch_id ?? user.branch_id, supplier_id, notes, delivery_address, requested_delivery_date, user.id]
      );
      const orderId = inserted.rows[0].id;
      let total = 0;
      for (const item of items) {
        const prod = await client.query(
          'SELECT id, name, unit, price_per_unit FROM products WHERE id = $1',
          [item.product_id]
        );
        if (!prod.rowCount) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: `Producto ${item.product_id} no encontrado en el catálogo` });
        }
        const p = prod.rows[0];
        const qty = Number(item.quantity);
        const subtotal = p.price_per_unit * qty;
        total += subtotal;
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, quantity, unit, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [orderId, p.id, p.name, qty, p.unit, p.price_per_unit, subtotal]
        );
      }
      await client.query('UPDATE orders SET total = $1 WHERE id = $2', [total, orderId]);
      await client.query(
        `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
         VALUES ($1, 'create', 'order', $2, $3::jsonb)`,
        [user.id, orderId, JSON.stringify({ total })]
      );
      await client.query('COMMIT');
      
      const full = await query(`${orderSelect()} WHERE o.id = $1`, [orderId]);
      const order = { ...full.rows[0], items: (await query('SELECT * FROM order_items WHERE order_id = $1', [orderId])).rows };
      emitOrder('order:created', order);
      if (order.supplier_email) {
        sendEmail({
          to_email: order.supplier_email,
          to_name: order.supplier_name,
          subject: `Nuevo pedido ${order.order_code}`,
          body: `Recibiste un pedido desde el carrito de compras ${order.order_code} por un total de $${total}.`,
        });
      }
      res.status(201).json(order);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - Detalle de una órden
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(`${orderSelect()} WHERE o.id = $1`, [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Pedido no encontrado' });
    const order = result.rows[0];
    const items = await query('SELECT * FROM order_items WHERE order_id = $1 ORDER BY id', [req.params.id]);
    res.json({ ...order, items: items.rows });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/status - Actualizar estado del pedido (Confirmado, Despachado, Entregado, Cancelado)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const user = req.user!;
    const { status } = req.body;
    const current = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!current.rowCount) return res.status(404).json({ error: 'Pedido no encontrado' });
    const order = current.rows[0];

    const allowed = STATUS_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `No se puede pasar de "${order.status}" a "${status}"` });
    }

    await query(`UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [status, req.params.id]);

    if (status === 'despachado') {
      const items = await query('SELECT product_id, quantity FROM order_items WHERE order_id = $1 AND product_id IS NOT NULL', [req.params.id]);
      for (const it of items.rows) {
        await query(
          `UPDATE products SET stock_available = GREATEST(stock_available - $1, 0), updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
          [it.quantity, it.product_id]
        );
      }
    }

    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, 'status', 'order', $2, $3::jsonb)`,
      [user.id, req.params.id, JSON.stringify({ status })]
    );

    const updated = await query(`${orderSelect()} WHERE o.id = $1`, [req.params.id]);
    emitOrder('order:updated', updated.rows[0]);
    res.json(updated.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;

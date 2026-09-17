import { Router } from 'express';
import { query } from '../config/db';
import { authRequired, roleRequired } from '../middleware/auth';

const router = Router();
router.use(authRequired);

function productBaseSelect() {
  return `SELECT p.*, pc.name AS category, pc.id AS category_id, s.name AS supplier_name
          FROM products p
          LEFT JOIN product_categories pc ON pc.id = p.category_id
          JOIN suppliers s ON s.id = p.supplier_id`;
}

// GET /api/products - Consultar productos para agregar al carrito
router.get('/', async (req, res, next) => {
  try {
    const user = req.user!;
    const { category_id, supplier_id, search } = req.query;
    const params: unknown[] = [];
    let sql = `${productBaseSelect()} WHERE p.is_active = TRUE`;

    if (user.role === 'proveedor_admin' && user.supplier_id) {
      params.push(user.supplier_id);
      sql += ` AND p.supplier_id = $${params.length}`;
    } else if (supplier_id) {
      params.push(supplier_id);
      sql += ` AND p.supplier_id = $${params.length}`;
    }
    if (user.role !== 'proveedor_admin') sql += ' AND p.stock_available > 0';
    if (category_id) {
      params.push(category_id);
      sql += ` AND p.category_id = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND p.name ILIKE $${params.length}`;
    }
    sql += ' ORDER BY p.name';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Obtener detalle de un producto
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(`${productBaseSelect()} WHERE p.id = $1`, [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;

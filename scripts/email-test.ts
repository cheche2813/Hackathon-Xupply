import dotenv from 'dotenv';
import { getEmailStatus, sendTestEmail } from '../src/lib/email';

dotenv.config();

async function main() {
  const to = (process.argv[2] || process.env.TEST_EMAIL_TO || '').trim();
  if (!to) {
    console.error('Uso: npm run email:test -- correo@tu-dominio.com');
    process.exit(1);
  }

  const status = getEmailStatus();
  console.log('Proveedor :', status.provider);
  console.log('From      :', status.from ?? '(sin configurar)');
  console.log('Reply-To  :', status.reply_to ?? '(sin configurar)');
  console.log('BCC       :', status.bcc ?? '(sin configurar)');
  if (status.warnings.length > 0) {
    for (const warning of status.warnings) console.warn('ADVERTENCIA:', warning);
  }
  if (!status.configured) {
    console.error('No hay proveedor de correo configurado. Revisa .env.example / EMAIL-ENTERPRISE.md');
    process.exit(1);
  }

  console.log(`\nEnviando correo de prueba a ${to}...`);
  const result = await sendTestEmail(to);
  if (result.ok) {
    console.log('OK: correo aceptado por el proveedor. Revisa la bandeja de entrada (y spam).');
    process.exit(0);
  }
  console.error('ERROR: el proveedor rechazó el envío. Revisa los logs anteriores.');
  process.exit(1);
}

main().catch((err) => {
  console.error('ERROR inesperado:', (err as Error)?.message || err);
  process.exit(1);
});

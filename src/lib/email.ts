export interface EmailParams {
  to_email: string;
  to_name?: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to_email, to_name, subject, body }: EmailParams) {
  console.log(`[Email Mock] Enviando correo a ${to_name || ''} <${to_email}>: "${subject}"`);
  console.log(`[Email Body]: ${body}`);
  return true;
}

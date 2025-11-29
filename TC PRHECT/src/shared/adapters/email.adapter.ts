/**
 * Interface para el adaptador de email
 * Permite intercambiar implementaciones (Nodemailer, SendGrid, etc.)
 */
export interface IEmailAdapter {
  sendAlert(data: { to: string; subject: string; body: string }): Promise<void>;
}

/**
 * Implementación del adaptador de email (Patrón Adapter)
 * Por ahora usa console.log como placeholder
 * En producción reemplazar con Nodemailer o SendGrid
 */
class EmailAdapter implements IEmailAdapter {
  async sendAlert(data: { to: string; subject: string; body: string }): Promise<void> {
    // TODO: Reemplazar con implementación real de Nodemailer
    console.log('\n📧 ========== EMAIL ENVIADO ==========');
    console.log(`   Para: ${data.to}`);
    console.log(`   Asunto: ${data.subject}`);
    console.log(`   Cuerpo:\n   ${data.body}`);
    console.log('=====================================\n');
  }
}

// Exportar instancia singleton
export const emailAdapter = new EmailAdapter();

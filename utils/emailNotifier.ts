import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  toEmail: string;
}

export class EmailNotifier {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });
  }

  async sendTestFailureNotification(testName: string, error: string, timestamp: string): Promise<void> {
    const subject = `🚨 Test Fallito: ${testName}`;
    const html = `
      <h2>🚨 Notifica Test Fallito</h2>
      <p><strong>Test:</strong> ${testName}</p>
      <p><strong>Timestamp:</strong> ${timestamp}</p>
      <p><strong>Errore:</strong></p>
      <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${error}</pre>
      <hr>
      <p><small>Questo messaggio è stato inviato automaticamente dal sistema di monitoraggio Playwright.</small></p>
    `;

    const mailOptions = {
      from: this.config.fromEmail,
      to: this.config.toEmail,
      subject: subject,
      html: html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email inviata:', info.messageId);
    } catch (error) {
      console.error('❌ Errore invio email:', error);
    }
  }

  async sendTestRecoveryNotification(testName: string, timestamp: string): Promise<void> {
    const subject = `✅ Test Ripristinato: ${testName}`;
    const html = `
      <h2>✅ Test Ripristinato</h2>
      <p><strong>Test:</strong> ${testName}</p>
      <p><strong>Timestamp:</strong> ${timestamp}</p>
      <p>Il test che precedentemente falliva ora funziona correttamente.</p>
      <hr>
      <p><small>Questo messaggio è stato inviato automaticamente dal sistema di monitoraggio Playwright.</small></p>
    `;

    const mailOptions = {
      from: this.config.fromEmail,
      to: this.config.toEmail,
      subject: subject,
      html: html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email di ripristino inviata:', info.messageId);
    } catch (error) {
      console.error('❌ Errore invio email di ripristino:', error);
    }
  }
}

// Configurazione email (da personalizzare con le tue credenziali)
export function getEmailConfig(): EmailConfig {
  const config = {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.EMAIL_USER || '',
    smtpPassword: process.env.EMAIL_PASSWORD || '',
    fromEmail: process.env.FROM_EMAIL || 'monitoring@playwright.com',
    toEmail: process.env.TO_EMAIL || 'adriano.ferrio@gmail.com',
  };
  
  // Avviso se le credenziali sono mancanti
  if (!config.smtpUser || !config.smtpPassword) {
    console.warn('ATTENZIONE: Credenziali SMTP mancanti! Le email non funzioneranno.');
    console.warn('Assicurati che le variabili EMAIL_USER e EMAIL_PASSWORD siano configurate');
  } else {
    console.log('📧 Configurazione email caricata correttamente');
  }
  
  return config;
}
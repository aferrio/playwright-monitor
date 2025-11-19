import { EmailNotifier, getEmailConfig } from '../utils/emailNotifier';
import { TelegramNotifier, getTelegramConfig } from '../utils/telegramNotifier';

export interface TestResult {
  testName: string;
  siteUrl: string;
  status: 'passed' | 'failed';
  error?: string;
  timestamp: string;
}

/**
 * Manager centralizzato per gestire i risultati dei test e l'invio delle email
 */
export class TestReportManager {
  private static instance: TestReportManager;
  private testResults: TestResult[] = [];
  private emailNotifier: EmailNotifier;
  private telegramNotifier: TelegramNotifier;

  private constructor() {
    const emailConfig = getEmailConfig();
    this.emailNotifier = new EmailNotifier(emailConfig);
    
    const telegramConfig = getTelegramConfig();
    this.telegramNotifier = new TelegramNotifier(telegramConfig);
  }

  public static getInstance(): TestReportManager {
    if (!TestReportManager.instance) {
      TestReportManager.instance = new TestReportManager();
    }
    return TestReportManager.instance;
  }

  /**
   * Registra il risultato di un test
   */
  public addTestResult(result: TestResult): void {
    this.testResults.push(result);
    console.log(`📊 Registrato risultato: ${result.testName} - ${result.status}`);
  }

  /**
   * Verifica se ci sono stati fallimenti
   */
  public hasFailures(): boolean {
    return this.testResults.some(result => result.status === 'failed');
  }

  /**
   * Ottiene tutti i risultati dei test falliti
   */
  public getFailedTests(): TestResult[] {
    return this.testResults.filter(result => result.status === 'failed');
  }

  /**
   * Ottiene tutti i risultati dei test passati
   */
  public getPassedTests(): TestResult[] {
    return this.testResults.filter(result => result.status === 'passed');
  }

  /**
   * Invia il report finale via email e Telegram solo se ci sono stati fallimenti
   */
  public async sendFinalReport(): Promise<void> {
    if (!this.hasFailures()) {
      console.log('✅ Tutti i test sono passati - Nessuna notifica inviata');
      return;
    }

    const failedTests = this.getFailedTests();
    const passedTests = this.getPassedTests();
    
    console.log('📧 Invio report finale...');

    // Invio email
    await this.sendEmailReport(failedTests, passedTests);

    // Invio notifica Telegram
    await this.sendTelegramReport(failedTests, passedTests);
  }

  private async sendEmailReport(failedTests: TestResult[], passedTests: TestResult[]): Promise<void> {
    const subject = `🚨 Report Test Monitoring - ${failedTests.length} fallimenti su ${this.testResults.length} test`;
    
    let html = `
      <h2>🚨 Report Test Monitoring</h2>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p><strong>Totale test:</strong> ${this.testResults.length}</p>
      <p><strong>✅ Test passati:</strong> ${passedTests.length}</p>
      <p><strong>❌ Test falliti:</strong> ${failedTests.length}</p>
      
      <hr>
      
      <h3>❌ Test Falliti</h3>
    `;

    failedTests.forEach(test => {
      html += `
        <div style="background-color: #ffebee; padding: 10px; margin: 10px 0; border-left: 4px solid #f44336;">
          <h4>${test.testName}</h4>
          <p><strong>URL:</strong> ${test.siteUrl}</p>
          <p><strong>Timestamp:</strong> ${test.timestamp}</p>
          <p><strong>Errore:</strong></p>
          <pre style="background-color: #f5f5f5; padding: 8px; border-radius: 4px; font-size: 12px;">${test.error}</pre>
        </div>
      `;
    });

    if (passedTests.length > 0) {
      html += `
        <hr>
        <h3>✅ Test Passati</h3>
        <ul>
      `;
      
      passedTests.forEach(test => {
        html += `<li><strong>${test.testName}</strong> - ${test.siteUrl}</li>`;
      });
      
      html += '</ul>';
    }

    html += `
      <hr>
      <p><small>Questo messaggio è stato inviato automaticamente dal sistema di monitoraggio Playwright.</small></p>
    `;

    try {
      const mailOptions = {
        from: this.emailNotifier['config'].fromEmail,
        to: this.emailNotifier['config'].toEmail,
        subject: subject,
        html: html,
      };

      const info = await this.emailNotifier['transporter'].sendMail(mailOptions);
      console.log('📧 Report finale inviato via email:', info.messageId);
    } catch (error) {
      console.error('❌ Errore invio report email:', error);
    }
  }

  private async sendTelegramReport(failedTests: TestResult[], passedTests: TestResult[]): Promise<void> {
    try {
      const telegramMessage = this.telegramNotifier.formatTestReport(
        failedTests.length,
        this.testResults.length,
        failedTests
      );

      await this.telegramNotifier.sendMessage(telegramMessage);
      console.log('📱 Report finale inviato via Telegram');
    } catch (error) {
      console.error('❌ Errore invio report Telegram:', error);
    }
  }

  /**
   * Reset dei risultati per una nuova sessione di test
   */
  public reset(): void {
    this.testResults = [];
    console.log('🔄 TestReportManager resettato');
  }

  /**
   * Ottiene statistiche riassuntive
   */
  public getStats(): { total: number; passed: number; failed: number; successRate: number } {
    const total = this.testResults.length;
    const passed = this.getPassedTests().length;
    const failed = this.getFailedTests().length;
    const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return { total, passed, failed, successRate };
  }
}
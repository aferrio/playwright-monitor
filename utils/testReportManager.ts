import { TelegramNotifier, getTelegramConfig } from '../utils/telegramNotifier';

export interface TestResult {
  testName: string;
  siteUrl: string;
  status: 'passed' | 'failed';
  error?: string;
  timestamp: string;
}

/**
 * Manager centralizzato per gestire i risultati dei test e l'invio delle notifiche
 */
export class TestReportManager {
  private static instance: TestReportManager;
  private testResults: TestResult[] = [];
  private telegramNotifier: TelegramNotifier;

  private constructor() {
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
   * Invia il report finale solo via Telegram se ci sono stati fallimenti
   */
  public async sendFinalReport(): Promise<void> {
    if (!this.hasFailures()) {
      console.log('✅ Tutti i test sono passati - Nessuna notifica inviata');
      return;
    }

    const failedTests = this.getFailedTests();
    const passedTests = this.getPassedTests();
    
    console.log('📱 Invio report finale via Telegram...');

    // Invio solo notifica Telegram
    await this.sendTelegramReport(failedTests, passedTests);
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
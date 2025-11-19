import TelegramBot from 'node-telegram-bot-api';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export class TelegramNotifier {
  private bot: TelegramBot;
  private chatId: string;

  constructor(config: TelegramConfig) {
    this.bot = new TelegramBot(config.botToken);
    this.chatId = config.chatId;
  }

  async sendMessage(message: string): Promise<boolean> {
    if (!this.chatId || !this.bot.token) {
      console.warn('⚠️ Configurazione Telegram mancante - messaggio non inviato');
      return false;
    }

    try {
      await this.bot.sendMessage(this.chatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });

      console.log('📱 Messaggio Telegram inviato con successo');
      return true;
    } catch (error) {
      console.error('❌ Errore invio messaggio Telegram:', error);
      return false;
    }
  }

  formatTestReport(failedCount: number, totalCount: number, failedTests: any[]): string {
    const successRate = Math.round(((totalCount - failedCount) / totalCount) * 100);
    
    let message = `🚨 <b>Alert Monitoring Siti</b>\n\n`;
    message += `📊 <b>Risultati:</b>\n`;
    message += `• Totale test: ${totalCount}\n`;
    message += `• ✅ Passati: ${totalCount - failedCount}\n`;
    message += `• ❌ Falliti: ${failedCount}\n`;
    message += `• 📈 Tasso successo: ${successRate}%\n\n`;

    if (failedTests.length > 0) {
      message += `❌ <b>Test Falliti:</b>\n`;
      failedTests.forEach((test, index) => {
        const siteName = test.testName.split(' - ')[0];
        const testType = test.testName.split(' - ')[1] || 'Test';
        message += `${index + 1}. <b>${siteName}</b>\n`;
        message += `   🔗 ${test.siteUrl}\n`;
        message += `   📝 ${testType}\n`;
        message += `   ⏰ ${new Date(test.timestamp).toLocaleString('it-IT')}\n\n`;
      });
    }

    message += `🤖 <i>Messaggio automatico da Playwright Monitor</i>`;
    
    return message;
  }
}

export function getTelegramConfig(): TelegramConfig {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  };
}
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
    
    let message = `🚨 <b>ERRORE HOMEPAGE MONITORING</b>\n\n`;
    message += `⚠️ Rilevati problemi sulle homepage monitorate:\n\n`;
    message += `📊 <b>Risultati controlli:</b>\n`;
    message += `• 🔍 Totale test homepage: ${totalCount}\n`;
    message += `• ✅ Homepage funzionanti: ${totalCount - failedCount}\n`;
    message += `• ❌ Homepage con errori: ${failedCount}\n`;
    message += `• 📈 Disponibilità siti: ${successRate}%\n\n`;

    if (failedTests.length > 0) {
      message += `🚫 <b>HOMEPAGE NON FUNZIONANTI:</b>\n`;
      failedTests.forEach((test, index) => {
        const siteName = test.testName.split(' - ')[0];
        const testType = test.testName.split(' - ')[1] || 'Homepage Test';
        
        // Determina l'icona in base al sito
        let siteIcon = '🌐';
        if (siteName.toLowerCase().includes('kruidvat')) {
          siteIcon = '🛒';
        } else if (siteName.toLowerCase().includes('trekpleister')) {
          siteIcon = '💊';
        }
        
        message += `${index + 1}. ${siteIcon} <b>${siteName}</b>\n`;
        message += `   🔗 Homepage: ${test.siteUrl}\n`;
        message += `   ❌ Problema: ${testType}\n`;
        message += `   ⏰ Rilevato: ${new Date(test.timestamp).toLocaleString('it-IT')}\n\n`;
      });
    }

    message += `🔄 <i>Controllo automatico homepage - Playwright Monitor</i>`;
    
    return message;
  }
}

export function getTelegramConfig(): TelegramConfig {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  };
}
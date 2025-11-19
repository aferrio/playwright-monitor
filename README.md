# 🔍 Playwright Site Monitor

Sistema completo di monitoraggio automatico per siti web con notifiche email e Telegram in caso di problemi.

## 🚀 Caratteristiche

- **Monitoraggio Multi-Sito**: Monitora automaticamente Kruidvat BE/NL e Trekpleister
- **Gestione Automatica Cookie**: Accetta automaticamente i popup dei cookie
- **Notifiche Dual-Channel**: Email dettagliate + notifiche Telegram istantanee
- **Report Centralizzato**: Un solo report finale dopo tutti i test
- **CI/CD Ready**: Workflow GitHub Actions preconfigurato
- **Anti-Bot Protection**: Configurazioni avanzate per evitare detection

## 📋 Requisiti

- Node.js 18+ 
- NPM/Yarn
- Account Gmail per notifiche email
- Bot Telegram per notifiche istantanee

## 🛠️ Installazione

### 1. Clone e Setup

```bash
git clone <repository-url>
cd playwright-monitor
npm install
npx playwright install chromium
```

### 2. Configurazione Email

Crea un file `.env` nella root del progetto:

```env
# Configurazione Email (Gmail)
EMAIL_USER=tuo-email@gmail.com
EMAIL_PASSWORD=tua-app-password-gmail
FROM_EMAIL=tuo-email@gmail.com
TO_EMAIL=destinatario@gmail.com

# Configurazione Telegram (opzionale ma consigliato)
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=-1001234567890
```

### 3. Setup Gmail App Password

1. Vai su [myaccount.google.com](https://myaccount.google.com)
2. **Sicurezza** → **Verifica in due passaggi** (deve essere attiva)
3. **Password delle app** → Genera nuova password
4. Copia la password generata in `EMAIL_PASSWORD`

### 4. Setup Bot Telegram (Opzionale)

1. Scrivi a [@BotFather](https://t.me/botfather) su Telegram
2. Digita `/newbot` e segui le istruzioni
3. Copia il **Bot Token** in `TELEGRAM_BOT_TOKEN`
4. Aggiungi il bot al tuo gruppo/chat
5. Invia un messaggio, poi vai su: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
6. Trova il `chat_id` e copialo in `TELEGRAM_CHAT_ID`

## 🏃‍♂️ Esecuzione

### Locale

```bash
# Esegui tutti i test
npm test

# Esegui test di un sito specifico
npx playwright test tests/kruidvat_be/
npx playwright test tests/kruidvat_nl/
npx playwright test tests/trekpleister/

# Esegui con interfaccia grafica (debug)
npx playwright test --ui

# Esegui in modalità headed (visualizza browser)
npx playwright test --headed
```

### GitHub Actions (CI/CD)

1. **Configura Secrets** nel repository GitHub:
   - `Settings` → `Secrets and variables` → `Actions`
   - Aggiungi tutti i secrets del file `.env`:
     - `EMAIL_USER`
     - `EMAIL_PASSWORD` 
     - `FROM_EMAIL`
     - `TO_EMAIL`
     - `TELEGRAM_BOT_TOKEN`
     - `TELEGRAM_CHAT_ID`

2. **Workflow automatico**:
   - Il monitoring gira automaticamente ogni ora dalle 7:00 alle 22:00 UTC
   - Può essere eseguito manualmente da `Actions` → `Site Monitoring` → `Run workflow`

## 📁 Struttura Progetto

```
playwright-monitor/
├── .github/workflows/
│   └── monitoring.yml          # GitHub Actions workflow
├── config/
│   └── sites.config.ts         # Configurazione siti
├── tests/
│   ├── kruidvat_be/           # Test Kruidvat Belgio
│   ├── kruidvat_nl/           # Test Kruidvat Olanda
│   └── trekpleister/          # Test Trekpleister
├── utils/
│   ├── cookieHelper.ts        # Gestione automatica cookie
│   ├── emailNotifier.ts       # Notifiche email
│   ├── telegramNotifier.ts    # Notifiche Telegram
│   └── testReportManager.ts   # Manager report centralizzato
├── playwright.config.ts       # Configurazione Playwright
├── package.json
└── README.md
```

## 🧪 Cosa Monitora

### Kruidvat Belgio & Olanda
- ✅ **Homepage Loading**: Verifica che la homepage si carichi correttamente
- ✅ **Content Validation**: Controlla la presenza di contenuti chiave
- ✅ **Cookie Acceptance**: Gestisce automaticamente popup cookie
- ✅ **Response Times**: Monitora i tempi di risposta

### Trekpleister
- ✅ **Site Accessibility**: Verifica accessibilità del sito
- ✅ **Navigation Check**: Testa la navigazione principale
- ✅ **Content Presence**: Valida la presenza di elementi critici

## 📧 Sistema Notifiche

### Email (Sempre attivo)
- **Report dettagliato** con:
  - Statistiche complete (totale, passati, falliti)
  - Dettagli errori con stack trace
  - Lista test passati
  - Timestamp e informazioni tecniche

### Telegram (Istantaneo)
- **Alert immediato** con:
  - Riassunto veloce stato test
  - Lista siti con problemi
  - Percentuale successo
  - Messaggio formattato e leggibile

### Quando vengono inviate?
- **Solo in caso di fallimenti**
- **Un solo report finale** (non per ogni test)
- **Dual-channel** (email + Telegram insieme)

## ⚙️ Configurazione Avanzata

### Timeouts Personalizzati

Modifica `config/sites.config.ts` per personalizzare timeouts per sito:

```typescript
export const SITES_CONFIG = {
  KRUIDVAT_BE: {
    // ... altre config
    timeout: 45000,        // 45 secondi
    navigationTimeout: 60000  // 60 secondi per navigazione
  }
};
```

### Cookie Selectors

Aggiungi nuovi selectors in `utils/cookieHelper.ts`:

```typescript
const COOKIE_SELECTORS = [
  '[data-testid="accept-cookies"]',
  '.cookie-accept-btn',
  // Aggiungi qui i tuoi selectors
];
```

### Anti-Bot Measures

La configurazione include già:
- User-Agent randomizzato
- Disabilitazione HTTP/2
- Gestione certificati
- Bypass detection automatiche

## 🔧 Troubleshooting

### ❌ Test Falliscono Sempre
1. Verifica connettività: `ping www.kruidvat.be`
2. Controlla proxy/firewall aziendale
3. Testa in locale con `--headed` per vedere il browser
4. Verifica logs in `test-results/`

### 📧 Email Non Arrivano
1. Verifica Gmail App Password (non password account)
2. Controlla spam/promo folder
3. Testa configurazione SMTP: `npm run test:email`
4. Verifica 2FA attivata su Gmail

### 📱 Telegram Non Funziona
1. Verifica Bot Token: `https://api.telegram.org/bot<TOKEN>/getMe`
2. Controlla Chat ID: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Assicurati che il bot sia nel gruppo/chat
4. Testa invio manuale: `npm run test:telegram`

### 🤖 Site Detection Issues
1. Aumenta delay tra azioni
2. Modifica User-Agent in `playwright.config.ts`
3. Aggiungi proxy se necessario
4. Usa `--slow-mo=1000` per debug

## 📊 Monitoring Dashboard

I risultati sono disponibili in:
- **GitHub Actions**: Logs dettagliati e artefatti
- **Email Reports**: Report HTML formattati
- **Telegram**: Alert immediati
- **Local**: `test-results/` e `playwright-report/`

## 🚀 Deploy Production

### Heroku/Railway/Vercel
1. Aggiungi variabili ambiente
2. Configura cron job o scheduler
3. Deploy dal repository GitHub

### Self-Hosted
```bash
# PM2 per processo persistente
npm install -g pm2
pm2 start "npm test" --name "site-monitor" --cron "0 */1 * * *"
```

## 🤝 Contribuire

1. Fork del repository
2. Crea branch feature: `git checkout -b feature/nuova-funzionalita`
3. Commit: `git commit -m 'Aggiunge nuova funzionalità'`
4. Push: `git push origin feature/nuova-funzionalita`
5. Apri Pull Request

## 📝 License

MIT License - vedi [LICENSE](LICENSE) per dettagli.

## 📞 Supporto

Per problemi o domande:
1. Apri un [Issue](../../issues) su GitHub
2. Controlla [Discussions](../../discussions) per FAQ
3. Consulta [Wiki](../../wiki) per guide avanzate

---

**🔥 Happy Monitoring!** 🔍✨

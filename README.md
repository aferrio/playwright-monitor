# 🔍 Playwright Site Monitor

Sistema completo di monitoraggio automatico per siti web con notifiche email e Telegram in caso di problemi.

## 🚀 Caratteristiche

- **Monitoraggio Multi-Sito**: Monitora automaticamente Kruidvat BE/NL e Trekpleister
- **Gestione Automatica Cookie**: Accetta automaticamente i popup dei cookie  
- **Notifiche Dual-Channel**: Email dettagliate + notifiche Telegram istantanee
- **Report Centralizzato**: Un solo report finale dopo tutti i test
- **CI/CD Ready**: Workflow GitHub Actions ottimizzato per headless
- **Configurazione Robusta**: Timeout dinamici e gestione errori avanzata
- **Contenuto Intelligente**: Verifica presenza di contenuti specifici per sito

## 📋 Requisiti

- Node.js 20+ 
- NPM
- Account Gmail per notifiche email
- Bot Telegram per notifiche istantanee

## 🛠️ Installazione

### 1. Clone e Setup

```bash
git clone https://github.com/aferrio/playwright-monitor.git
cd playwright-monitor
npm install
npx playwright install --with-deps chromium
```

### 2. Configurazione Email

Crea un file `.env` nella root del progetto:

```env
# Configurazione Email (Gmail)
EMAIL_USER=tuo-email@gmail.com
EMAIL_PASSWORD=tua-app-password-gmail
FROM_EMAIL=tuo-email@gmail.com
TO_EMAIL=destinatario@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

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
   - Il monitoring gira automaticamente **ogni 5 minuti** 24/7
   - Può essere eseguito manualmente da `Actions` → `Site Monitoring` → `Run workflow`
   - Configurazione CI ottimizzata per ambiente headless Ubuntu

## 📁 Struttura Progetto

```
playwright-monitor/
├── .github/workflows/
│   └── monitoring.yml          # GitHub Actions workflow (ogni 5 min)
├── config/
│   └── sites.config.ts         # Configurazione siti e timeout
├── tests/
│   ├── kruidvat_be/           # Test Kruidvat Belgio
│   ├── kruidvat_nl/           # Test Kruidvat Olanda (+ Weektoppers)
│   └── trekpleister/          # Test Trekpleister (+ Uit onze folder)
├── utils/
│   ├── cookieHelper.ts        # Gestione automatica cookie
│   ├── emailNotifier.ts       # Notifiche email
│   ├── telegramNotifier.ts    # Notifiche Telegram
│   └── testReportManager.ts   # Manager report centralizzato
├── playwright.config.ts       # Configurazione Playwright ottimizzata
├── package.json
└── README.md
```

## 🧪 Cosa Monitora

### Kruidvat België
- ✅ **Homepage Loading**: Verifica caricamento e titolo
- ✅ **Content Validation**: Controlla presenza di 'Kruidvat', 'apotheek', 'gezondheid'
- ✅ **Cookie Management**: Gestione automatica popup

### Kruidvat Nederland  
- ✅ **Homepage Loading**: Verifica caricamento e titolo
- ✅ **Content Validation**: Controlla presenza di 'Kruidvat', 'apotheek', 'gezondheid', 'drogist', **'Weektoppers'**
- ✅ **Cookie Management**: Gestione automatica popup

### Trekpleister
- ✅ **Homepage Loading**: Verifica caricamento e titolo  
- ✅ **Content Validation**: Controlla presenza di **'Uit onze folder'**, 'Trekpleister'
- ✅ **Cookie Management**: Gestione automatica popup
- ✅ **Extended Timeouts**: Configurazioni specifiche per maggiore stabilità

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

### GitHub Repository Secrets

Nel tuo repository GitHub (`Settings` → `Secrets and variables` → `Actions`), configura:

```
📧 Email/Gmail:
EMAIL_USER=tuo-email@gmail.com
EMAIL_PASSWORD=tua-app-password-gmail  
FROM_EMAIL=tuo-email@gmail.com
TO_EMAIL=destinatario@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

🤖 Telegram:
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF...
TELEGRAM_CHAT_ID=-1001234567890
```

### Timeout Dinamici

Il sistema usa timeout diversi per locale vs CI:

```typescript
NAVIGATION: process.env.CI ? 120000 : 60000,    // 2min CI, 1min locale  
ELEMENT_WAIT: process.env.CI ? 30000 : 10000,   // 30s CI, 10s locale
TREKPLEISTER_LOAD_DELAY: process.env.CI ? 15000 : 5000  // 15s CI, 5s locale
```

### Contenuti Verificati per Sito

```typescript
KRUIDVAT_BE: ['Kruidvat', 'apotheek', 'gezondheid']
KRUIDVAT_NL: ['Kruidvat', 'apotheek', 'gezondheid', 'drogist', 'Weektoppers']  
TREKPLEISTER: ['Uit onze folder', 'Trekpleister']
```

### Configurazioni Browser Avanzate

- **Headless ottimizzato**: Disabilitazione HTTP/2, QUIC per stabilità
- **Anti-detection**: Headers realistici, user-agent autentico
- **CI-Ready**: 1 worker, retry extra, timeout estesi
- **Network stability**: Cache control, certificati ignorati

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

### ❌ Test Falliscono in GitHub Actions
1. Verifica che tutti i **Repository Secrets** siano configurati
2. Controlla logs delle Actions per errori specifici
3. Verifica connettività: timeout potrebbero essere insufficienti
4. Usa `workflow_dispatch` per test manuali

### 📧 Email Non Arrivano
1. Verifica Gmail **App Password** (non password account normale)
2. Controlla cartella spam/promozioni
3. Assicurati che **2FA sia attivata** su Gmail
4. Verifica che `SMTP_HOST` e `SMTP_PORT` siano corretti nei secrets

### 📱 Telegram Non Funziona  
1. Verifica Bot Token: `https://api.telegram.org/bot<TOKEN>/getMe`
2. Controlla Chat ID: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Assicurati che il bot sia aggiunto al gruppo/chat
4. Testa localmente con le stesse variabili d'ambiente

### 🌐 Errori di Navigazione (ERR_ABORTED, ERR_HTTP2_PROTOCOL_ERROR)
1. Il sistema è già ottimizzato con flags anti-errore
2. Se persistono: aumenta timeout in `sites.config.ts`  
3. Controlla se i siti hanno cambiato architettura
4. Verifica logs Playwright per dettagli specifici

### 🔍 Contenuti Non Trovati
1. Verifica che i testi in `expectedContent` esistano ancora sui siti
2. I controlli sono **case-insensitive**
3. **TUTTI** i contenuti devono essere presenti (logica AND)
4. Usa browser headless locale per debug: `npx playwright test --headed`

## 📊 Monitoring Dashboard

I risultati sono disponibili in:
- **GitHub Actions**: Logs dettagliati, artifacts e history completa  
- **Email Reports**: Report HTML formattati con statistiche complete
- **Telegram**: Alert immediati con icone per sito (🛒 Kruidvat, 💊 Trekpleister)
- **Local**: `test-results/` e `playwright-report/` per sviluppo

## 🚀 Deploy e Utilizzo

### Test Locali
```bash
# Esegui tutti i test
npm test

# Test specifici per sito
npx playwright test tests/kruidvat_be/
npx playwright test tests/kruidvat_nl/  
npx playwright test tests/trekpleister/

# Debug con browser visibile
npx playwright test --headed

# UI interattiva per sviluppo
npx playwright test --ui
```

### GitHub Actions (Produzione)
1. **Push del codice** → Attivazione automatica ogni 5 minuti
2. **Esecuzione manuale** → `Actions` tab → `Site Monitoring` → `Run workflow`
3. **Monitoring continuo** → 24/7 senza interventi
4. **Notifiche automatiche** → Solo in caso di problemi

### Configurazione Secrets
Nel repository GitHub, configura questi secrets obbligatori:
- `EMAIL_USER`, `EMAIL_PASSWORD`, `FROM_EMAIL`, `TO_EMAIL`
- `SMTP_HOST`, `SMTP_PORT`  
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

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

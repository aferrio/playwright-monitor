# 📧 Configurazione Email per Playwright Monitor

## Configurazione delle Notifiche Email

Quando i test falliscono, il sistema invierà automaticamente una email a `adriano.ferrio@gmail.com`.

### 1. Configurazione Gmail (Consigliata)

1. **Crea un file `.env`** nella root del progetto:
```bash
cp .env.example .env
```

2. **Modifica il file `.env`** con le tue credenziali Gmail:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tuo-email@gmail.com
SMTP_PASSWORD=tua-app-password
FROM_EMAIL=tuo-email@gmail.com
```

3. **Genera una App Password per Gmail**:
   - Vai su [Google Account Settings](https://myaccount.google.com/)
   - Attiva la **2-Factor Authentication**
   - Vai su [App Passwords](https://myaccount.google.com/apppasswords)
   - Genera una nuova app password per "Mail"
   - Usa questa password nel campo `SMTP_PASSWORD`

### 2. Configurazione Outlook/Hotmail

Se preferisci usare Outlook:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tuo-email@outlook.com
SMTP_PASSWORD=tua-password
FROM_EMAIL=tuo-email@outlook.com
```

### 3. Test della Configurazione

Dopo aver configurato le variabili d'ambiente, puoi testare:

```bash
npm test
```

Se i test falliscono, dovresti ricevere una email con i dettagli dell'errore.

### 4. Tipi di Notifiche

Il sistema invia due tipi di email:

- **🚨 Test Fallito**: Quando un test fallisce, con dettagli dell'errore
- **✅ Test Ripristinato**: Quando un test precedentemente fallito torna a funzionare

### 5. Sicurezza

- **Non committare mai il file `.env`** (è già nel .gitignore)
- Usa sempre App Passwords invece delle password normali
- Considera l'uso di service account dedicati per il monitoring

### 6. Troubleshooting

Se le email non arrivano:

1. **Controlla i log**: Cerca messaggi di errore nell'output del test
2. **Verifica le credenziali**: Assicurati che SMTP_USER e SMTP_PASSWORD siano corretti
3. **Controlla la porta**: Gmail usa 587 (TLS) o 465 (SSL)
4. **Firewall**: Assicurati che le porte SMTP non siano bloccate

### 7. Variabili d'Ambiente Supportate

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `SMTP_HOST` | Server SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP | `587` |
| `SMTP_USER` | Username SMTP | - |
| `SMTP_PASSWORD` | Password SMTP | - |
| `FROM_EMAIL` | Email mittente | `monitoring@playwright.com` |
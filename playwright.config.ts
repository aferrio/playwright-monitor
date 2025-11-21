import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Carica variabili d'ambiente
dotenv.config();

/**
 * Configurazione Playwright per il monitoraggio di siti web
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Esegui test in parallelo */
  fullyParallel: true,
  
  /* Fallisce la build in CI se hai lasciato test.only */
  forbidOnly: !!process.env.CI,
  
  /* Retry sui fallimenti in CI */
  retries: process.env.CI ? 2 : 1,
  
  /* Reporter per diversi ambienti */
  reporter: process.env.CI 
    ? [['html'], ['github']] 
    : [['list'], ['html']],
  
  /* Configurazione globale per tutti i test */
  use: {
    /* URL base per le tue applicazioni */
    // baseURL: 'https://www.trekpleister.nl',
    
    /* Raccolta trace sui fallimenti */
    trace: 'on-first-retry',
    
    /* Screenshot sui fallimenti */
    screenshot: 'only-on-failure',
    
    /* Video sui fallimenti */
    video: 'retain-on-failure',
    
    /* Timeout di navigazione */
    navigationTimeout: 60 * 1000, // 60 secondi
    
    /* Timeout di azione */
    actionTimeout: 30 * 1000, // 30 secondi
    
    /* Ignora errori HTTPS (utile per monitoring) */
    ignoreHTTPSErrors: true,
    
    /* User Agent realistico */
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    /* Headers extra per sembrare un browser reale */
    extraHTTPHeaders: {
      'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    
    /* Locale olandese per Trekpleister */
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam',
    
    /* Viewport standard */
    viewport: { width: 1366, height: 768 },
    
    /* Gestione automatica permessi per notifiche, geolocalizzazione, ecc */
    permissions: ['notifications'],
    
    /* Accetta automaticamente dialoghi del browser */
    acceptDownloads: true
  },

  /* Configurazione progetti per diversi browser */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        
        /* Configurazioni specifiche per Chromium */
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-client-side-phishing-detection',
            '--disable-crash-reporter',
            '--disable-oopr-debug-crash-dump',
            '--no-crash-upload',
            '--disable-low-res-tiling',
            '--disable-extensions',
            '--disable-default-apps',
            '--disable-http2',
            '--disable-quic',
            '--disable-site-isolation-trials',
            '--disable-blink-features=AutomationControlled',
            '--disable-component-extensions-with-background-pages',
            '--disable-ipc-flooding-protection',
            '--ignore-certificate-errors',
            '--ignore-ssl-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-features=TranslateUI',
            '--disable-features=VizDisplayCompositor,VizHitTestSurfaceLayer',
            '--run-all-compositor-stages-before-draw',
            '--disable-threaded-animation',
            '--disable-threaded-scrolling',
            '--disable-checker-imaging',
            '--disable-frame-rate-limit',
            '--disable-background-media-suspend',
            '--disable-domain-reliability',
            '--disable-sync',
            '--disable-translate',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-plugins',
            '--disable-extensions-file-access-check',
            '--disable-extensions-http-throttling',
            '--aggressive-cache-discard',
            '--enable-features=NetworkService,NetworkServiceLogging',
            '--force-device-scale-factor=1',
            '--hide-scrollbars'
          ]
        }
      },
    },

    /* Progetti per altri browser (opzionali, commentati per ora) */
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */

    /* Progetti mobile (opzionali per test responsive) */
    /*
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    */
  ],

  /* Timeout globali */
  timeout: 90 * 1000, // 90 secondi per test
  expect: {
    timeout: 15 * 1000 // 15 secondi per assertions
  },

  /* Configurazione server di sviluppo (se necessario) */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* Configurazione output */
  outputDir: 'test-results/',
  
  /* Configurazione per CI/CD */
  ...(process.env.CI && {
    /* In CI usa headless e configurazioni ottimizzate */
    use: {
      headless: true,
      /* Timeout più corti per CI per evitare hanging */
      navigationTimeout: 60 * 1000, // 1 minuto
      actionTimeout: 30 * 1000, // 30 secondi
      /* Bypass aggressivo per CI */
      bypassCSP: true,
      /* Ignora tutti gli errori SSL */
      ignoreHTTPSErrors: true,
      /* Video solo per fallimenti */
      video: 'retain-on-failure',
      /* Screenshot sempre in CI */
      screenshot: 'only-on-failure',
    },
    /* Un solo worker in CI per evitare conflitti di risorse */
    workers: 1,
    /* Retry ridotti in CI per evitare hanging */
    retries: 0,
    /* Timeout globale più corto per evitare hanging */
    timeout: 120 * 1000, // 2 minuti max per test
    expect: {
      timeout: 20 * 1000 // 20 secondi per assertions
    }
  }),

  /* Worker settings per performance */
  workers: process.env.CI ? 1 : undefined,
  
  /* Global setup/teardown se necessario */
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),
});
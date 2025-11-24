import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. */
  reporter: 'html',
  
  /* Global timeout - molto breve per Akamai CDN */
  timeout: 30 * 1000,
  
  /* Shared settings for all the projects below. */
  use: {
    // Emulates the user locale.
    locale: 'nl-NL',

    // Emulates the user timezone.
    timezoneId: 'Europe/Amsterdam',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',

    viewport: { width: 1920, height: 1080 },
    isMobile: false,
    hasTouch: false,

    // Headers realistici per bypassare Akamai CDN
    extraHTTPHeaders: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8,en-US;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0'
    },

    launchOptions: {
      args: [
        // Nascondere automazione
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-background-timer-throttling',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-reporting',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--disable-dev-shm-usage',
        
        // Network e sicurezza
        '--disable-http2',
        '--disable-web-security',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
        '--ignore-certificate-errors-tls-handshake',
        '--disable-component-extensions-with-background-pages',
        
        // Anti-detection per Akamai CDN
        '--disable-blink-features=AutomationControlled',
        '--exclude-switches=enable-automation',
        '--disable-automation',
        '--disable-default-apps',
        '--disable-plugins-discovery',
        '--disable-preconnect',
        '--disable-background-networking',
        '--aggressive-cache-discard',
        '--disable-domain-reliability',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-reporting',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        
        // Network e sicurezza per Akamai
        '--disable-http2',
        '--disable-quic',
        '--disable-web-security',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
        '--ignore-certificate-errors-tls-handshake',
        '--disable-component-extensions-with-background-pages',
        '--disable-features=VizDisplayCompositor,TranslateUI',
        '--allow-running-insecure-content',
        '--disable-ipc-flooding-protection',
        
        // User agent matching
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    },

    // Timeout per siti Akamai CDN
    actionTimeout: 30000,
    navigationTimeout: 45000,
    
    // Ignora errori HTTPS
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'KVNL - chromium',
      testDir: './tests/kruidvat_nl',
      use: { 
        baseURL: 'https://www.kruidvat.nl',
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'KVB - chromium',
      testDir: './tests/kruidvat_be',
      use: { 
        baseURL: 'https://www.kruidvat.be',
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'TP - chromium',
      testDir: './tests/trekpleister',
      use: { 
        baseURL: 'https://www.trekpleister.nl',
        ...devices['Desktop Chrome']
      }
    }
  ]
});
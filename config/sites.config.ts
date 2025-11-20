/**
 * Configurazione centrale delle URL per il monitoring
 */

export interface SiteConfig {
  name: string;
  url: string;
  locale: string;
  expectedContent: string[];
  titlePattern: RegExp;
}

export const SITES_CONFIG: Record<string, SiteConfig> = {
  KRUIDVAT_BE: {
    name: 'Kruidvat België',
    url: 'https://www.kruidvat.be',
    locale: 'nl-BE',
    expectedContent: ['Kruidvat', 'apotheek', 'gezondheid'],
    titlePattern: /Kruidvat/i
  },
  
  KRUIDVAT_NL: {
    name: 'Kruidvat Nederland',
    url: 'https://www.kruidvat.nl',
    locale: 'nl-NL',
    expectedContent: ['Kruidvat', 'apotheek', 'gezondheid', 'drogist', 'Weektoppers'],
    titlePattern: /Kruidvat/i
  },
  
  TREKPLEISTER: {
    name: 'Trekpleister',
    url: 'https://www.trekpleister.nl',
    locale: 'nl-NL',
    expectedContent: ['Uit onze folder', 'Trekpleister'],
    titlePattern: /Trekpleister/i
  }
};

// URL di test per verificare la connettività
export const TEST_URLS = {
  CONNECTIVITY_CHECK: 'https://httpbin.org/ip'
};

// Timeout configurazioni
export const TIMEOUTS = {
  NAVIGATION: 60000,
  QUICK_NAVIGATION: 30000,
  ELEMENT_WAIT: 10000,
  RETRY_DELAY: 5000,
  PAGE_LOAD_DELAY: 3000,
  TREKPLEISTER_LOAD_DELAY: 5000
};

// Configurazioni retry
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  DELAY_BETWEEN_RETRIES: 5000
};
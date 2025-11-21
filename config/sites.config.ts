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
    name: 'Kruidvat Belgium',
    url: 'https://www.kruidvat.be/nl',
    locale: 'nl-BE',
    expectedContent: ['Kruidvat', 'Klantenservice', 'gezondheid','Algemene verkoopvoorwaarden'],
    titlePattern: /Kruidvat/i
  },
  
  KRUIDVAT_NL: {
    name: 'Kruidvat Nederland',
    url: 'https://www.kruidvat.nl',
    locale: 'nl-NL',
    expectedContent: ['Kruidvat', 'Blog inspiratie', 'gezondheid', 'Algemene Verkoopvoorwaarden', 'Weektoppers'],
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

// Timeout configurazioni
export const TIMEOUTS = {
  NAVIGATION: process.env.CI ? 300000 : 60000,  // 5 min in CI, 1 min locale
  ELEMENT_WAIT: process.env.CI ? 60000 : 10000,  // 1 min in CI, 10s locale
  RETRY_DELAY: 5000,
  PAGE_LOAD_DELAY: process.env.CI ? 15000 : 3000,  // 15s in CI, 3s locale
};


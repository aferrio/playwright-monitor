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
    expectedContent: ['Kruidvat', 'Baby', 'Algemene Verkoopvoorwaarden'],
    titlePattern: /Kruidvat/i
  },
  
  TREKPLEISTER: {
    name: 'Trekpleister',
    url: 'https://www.trekpleister.nl',
    locale: 'nl-NL',
    expectedContent: ['Meer aandacht voor jou!', 'Trekpleister'],
    titlePattern: /Trekpleister/i
  }
};

// Timeout brevissimi per siti Akamai CDN
export const TIMEOUTS = {
  NAVIGATION: 15000,        // 15 secondi max navigazione
  ELEMENT_WAIT: 8000,       // 8 secondi max elementi
  RETRY_DELAY: 2000,        // 2 secondi tra retry
  PAGE_LOAD_DELAY: 1000,    // 1 secondo attesa caricamento
};


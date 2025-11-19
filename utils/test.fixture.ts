import { test as base } from '@playwright/test';
import { TestReportManager } from '../utils/testReportManager';

// Estende il test di Playwright per includire il report manager
export const test = base.extend<{}, { reportManager: TestReportManager }>({
  // Worker-scoped fixture che gestisce il report manager
  reportManager: [async ({}, use, workerInfo) => {
    const reportManager = TestReportManager.getInstance();
    
    // Reset all'inizio di ogni worker
    if (workerInfo.workerIndex === 0) {
      reportManager.reset();
    }
    
    await use(reportManager);
    
    // Invia il report finale solo dal primo worker e solo alla fine
    if (workerInfo.workerIndex === 0) {
      await reportManager.sendFinalReport();
    }
  }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';
import { test, expect } from '@playwright/test';

test('landing page flow', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check rebranding in nav
  await expect(page.getByText('NEBULA X', { exact: true })).toBeVisible();

  // Check main title
  await expect(page.locator('h1')).toContainText('NEBULA');

  // Check for navigation links
  await expect(page.getByRole('button', { name: 'Telemetry' })).toBeVisible();

  // Check Briefing Modal
  await page.getByText('Project Briefing').click();
  await expect(page.getByText('Mission Architecture')).toBeVisible();
  await page.getByText('✕').click();
  await expect(page.getByText('Mission Architecture')).not.toBeVisible();

  // Start sequence
  const launchBtn = page.getByRole('button', { name: 'Initiate Drive' });
  await launchBtn.click();

  // Wait for travel state (the button text changes and "Hyperspace Active" appears)
  await expect(page.getByText('Hyperspace Active')).toBeVisible({ timeout: 20000 });

  // Click abort (Disengage)
  await page.waitForTimeout(1000); await page.getByRole('button', { name: '[ DISENGAGE ]' }).click();
  await expect(page.getByRole('button', { name: 'Initiate Drive' })).toBeVisible();
});

import { test, expect } from '@playwright/test';

test.describe('Shell', () => {
  test('page title is present', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('App host');
  });

  test('default route renders Home heading', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('#appContainer h1')).toContainText('Home');
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="#/"]')).toBeVisible();
    await expect(page.locator('nav a[href="#/about"]')).toBeVisible();
    await expect(page.locator('nav a[href="#/contact"]')).toBeVisible();
    await expect(page.locator('nav a[href="#/mfe1"]')).toBeVisible();
  });

  test('contact route renders contact form', async ({ page }) => {
    await page.goto('/#/contact');
    // Wait for the fetched HTML to be injected
    await expect(page.locator('#appContainer h2')).toContainText('Contact Us');
    await expect(page.locator('#appContainer form')).toBeVisible();
  });

  test('clicking Contact nav link navigates to contact route', async ({ page }) => {
    await page.goto('/');
    await page.click('nav a[href="#/contact"]');
    await expect(page).toHaveURL(/#\/contact/);
    await expect(page.locator('#appContainer h2')).toContainText('Contact Us');
  });

  test('clicking Home nav link renders Home heading', async ({ page }) => {
    await page.goto('/#/contact');
    await page.click('nav a[href="#/"]');
    await expect(page.locator('#appContainer h1')).toContainText('Home');
  });
});

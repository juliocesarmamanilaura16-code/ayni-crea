import { test, expect } from '@playwright/test';

test.describe('Flujo principal Ayni Crea', () => {
  test('homepage carga correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Créalo');
    await expect(page.locator('text=Marketplace artesanal')).toBeVisible();
  });

  test('navegación a explorar funciona', async ({ page }) => {
    await page.goto('/');
    await page.click('nav >> text=Explorar');
    await page.waitForURL(/.*explorar/);
    await expect(page.locator('h1')).toContainText('Explorar');
  });

  test('navegación a artesanos funciona', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Artesanos');
    await page.waitForURL(/.*artesanos/);
    await expect(page.locator('h1')).toContainText('Maestros de El Alto y La Paz');
  });

  test('flujo crear producto: categoría → producto → personalizar', async ({ page }) => {
    await page.goto('/crear');
    await expect(page.locator('h1')).toContainText('¿Qué quieres crear?');

    await page.click('button:has-text("Textiles")');
    await expect(page.locator('h2')).toContainText('Productos disponibles');

    await page.click('a:has-text("Aguayo personalizado")');
    await page.waitForURL(/.*crear\/p1/);
  });

  test('detalle de producto muestra opciones', async ({ page }) => {
    await page.goto('/producto/p1');
    await expect(page.locator('h1')).toContainText('Aguayo personalizado');
    await expect(page.locator('h3:has-text("Color")')).toBeVisible();
    await expect(page.locator('h3:has-text("Material")')).toBeVisible();
    await expect(page.locator('h3:has-text("Tamaño")')).toBeVisible();
  });

  test('carrito vacío muestra mensaje', async ({ page }) => {
    await page.goto('/carrito');
    await expect(page.locator('text=Tu carrito está vacío')).toBeVisible();
  });

  test('login page accesible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Iniciar sesión');
    await expect(page.locator('button:has-text("Soy cliente")')).toBeVisible();
    await expect(page.locator('button:has-text("Soy artesano")')).toBeVisible();
  });

  test('registro page accesible', async ({ page }) => {
    await page.goto('/registro');
    await expect(page.locator('h1')).toContainText('Crear cuenta');
  });
});
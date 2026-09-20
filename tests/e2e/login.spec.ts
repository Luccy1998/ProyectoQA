import { test, expect } from '@playwright/test';
import { environment } from '../../config/environment';

test.describe('Pruebas E2E - SauceDemo', () => {

  test('E2E-001 - Login exitoso con usuario válido', async ({ page }) => {

    await test.step(
      'Abrir la página de inicio de SauceDemo',
      async () => {
        await page.goto(environment.webBaseUrl);
      }
    );

    await test.step(
      'Ingresar usuario válido',
      async () => {
        await page
          .locator('[data-test="username"]')
          .fill('standard_user');
      }
    );

    await test.step(
      'Ingresar contraseña válida',
      async () => {
        await page
          .locator('[data-test="password"]')
          .fill('secret_sauce');
      }
    );

    await test.step(
      'Presionar el botón de inicio de sesión',
      async () => {
        await page
          .locator('[data-test="login-button"]')
          .click();
      }
    );

    await test.step(
      'Verificar que el usuario llegue al catálogo de productos',
      async () => {
        await expect(page).toHaveURL(/inventory\.html/);
      }
    );

    await test.step(
      'Verificar que se muestre el catálogo de productos',
      async () => {
        await expect(
          page.locator('[data-test="title"]')
        ).toHaveText('Products');
      }
    );

  });

});
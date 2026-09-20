import { test, expect } from '@playwright/test';
import { environment } from '../../config/environment';



test.describe('Pruebas API - FakeStore', () => {

  test('API-001 - Obtener productos correctamente', async ({ request }) => {

    const response = await test.step(
      'Enviar GET al endpoint de productos',
      async () => {
        return await request.get(
          `${environment.apiBaseUrl}/products`
        );
      }
    );

    await test.step(
      'Verificar que la respuesta HTTP sea 200',
      async () => {
        expect(response.status()).toBe(200);
      }
    );

    const products = await test.step(
      'Obtener y validar el cuerpo de la respuesta',
      async () => {
        const body = await response.json();

        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);

        return body;
      }
    );

    await test.step(
      'Verificar que exista al menos un producto',
      async () => {
        expect(products.length).toBeGreaterThan(0);
      }
    );
  });


  test('API-002 - Endpoint inexistente debe retornar 404', async ({ request }) => {

    const response = await test.step(
      'Enviar GET a un endpoint inexistente',
      async () => {
        return await request.get(
          `${environment.apiBaseUrl}/endpoint-que-no-existe`
        );
      }
    );

    await test.step(
      'Verificar que la API retorne HTTP 404',
      async () => {
        expect(response.status()).toBe(404);
      }
    );
  });


  test('API-003 - Categoría inexistente debe retornar lista vacía', async ({ request }) => {

    const response = await test.step(
      'Enviar GET para una categoría inexistente',
      async () => {
        return await request.get(
          `${environment.apiBaseUrl}/products/category/categoria-que-no-existe`
        );
      }
    );

    await test.step(
      'Verificar que la respuesta HTTP sea 200',
      async () => {
        expect(response.status()).toBe(200);
      }
    );

    const products = await test.step(
      'Obtener el cuerpo de la respuesta',
      async () => {
        return await response.json();
      }
    );

    await test.step(
      'Verificar que la respuesta sea una lista vacía',
      async () => {
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBe(0);
      }
    );
  });

});
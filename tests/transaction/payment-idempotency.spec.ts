import { test, expect } from '@playwright/test';
import { PaymentService } from '../../mocks/payment-service';

test.describe('Pruebas transaccionales - Pago e Idempotencia', () => {

  test('TRX-001 - Pago duplicado debe procesarse una sola vez', async () => {

    const paymentService = new PaymentService();

    const notification = {
      trackingId: 'TRACK-001',
      paymentId: 'PAY-001',
      idempotencyKey: 'IDEMP-001',
      amount: 100,
    };

    const firstResult = await test.step(
      'Procesar la primera notificación de pago',
      async () => {
        return await paymentService.processNotification(notification);
      }
    );

    await test.step(
      'Verificar que el primer pago sea procesado correctamente',
      async () => {
        expect(firstResult.status).toBe('PROCESSED');
        expect(firstResult.httpStatus).toBe(200);
        expect(firstResult.trackingId).toBe('TRACK-001');
        expect(firstResult.trackingStatus).toBe('PAID');
      }
    );

    await test.step(
      'Verificar la respuesta del primer procesamiento',
      async () => {
        expect(firstResult.body.trackingId).toBe('TRACK-001');
        expect(firstResult.body.status).toBe('PAID');
        expect(firstResult.body.message).toBe(
          'Pago procesado correctamente'
        );
      }
    );

    const secondResult = await test.step(
      'Enviar nuevamente la misma notificación de pago',
      async () => {
        return await paymentService.processNotification(notification);
      }
    );

    await test.step(
      'Verificar que la segunda notificación sea identificada como duplicada',
      async () => {
        expect(secondResult.status).toBe('DUPLICATE');
        expect(secondResult.httpStatus).toBe(200);
        expect(secondResult.trackingId).toBe('TRACK-001');
        expect(secondResult.trackingStatus).toBe('PAID');
      }
    );

    await test.step(
      'Verificar la respuesta de la notificación duplicada',
      async () => {
        expect(secondResult.body.trackingId).toBe('TRACK-001');
        expect(secondResult.body.status).toBe('ALREADY_PROCESSED');
      }
    );

    await test.step(
      'Verificar que ambas notificaciones representen el mismo cobro',
      async () => {
        expect(firstResult.chargeId).toBe(secondResult.chargeId);
      }
    );

    await test.step(
      'Verificar que el inventario se descuente una sola vez',
      async () => {
        expect(firstResult.inventoryDeductionId).toBe(
          secondResult.inventoryDeductionId
        );
      }
    );

    await test.step(
      'Verificar que solamente exista un cobro',
      async () => {
        expect(paymentService.getChargeCount()).toBe(1);
      }
    );

    await test.step(
      'Verificar que solamente exista un descuento de inventario',
      async () => {
        expect(paymentService.getInventoryDeductionCount()).toBe(1);
      }
    );
  });

});
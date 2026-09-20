import { test, expect } from '@playwright/test';
import { QueueService } from '../../mocks/queue-service';

test.describe('Pruebas asíncronas - Procesamiento de cola', () => {

  test('ASYNC-001 - Procesar mensaje y controlar duplicados', async () => {

    const queueService = new QueueService();

    const message = await test.step(
      'Enviar mensaje de confirmación de pago a la cola',
      async () => {
        return await queueService.sendMessage({
          trackingId: 'TRACK-ASYNC-001',
          idempotencyKey: 'IDEMP-ASYNC-001',
          type: 'PAYMENT_CONFIRMED',
        });
      }
    );

    await test.step(
      'Verificar que el mensaje ingrese como pendiente',
      async () => {
        expect(message.processed).toBe(false);
        expect(queueService.getPendingMessageCount()).toBe(1);
      }
    );

    const receivedMessage = await test.step(
      'Obtener el mensaje pendiente de la cola',
      async () => {
        return await queueService.receiveMessage();
      }
    );

    await test.step(
      'Verificar que el mensaje recibido corresponda al tracking esperado',
      async () => {
        expect(receivedMessage).toBeDefined();
        expect(receivedMessage?.trackingId).toBe('TRACK-ASYNC-001');
      }
    );

    if (!receivedMessage) {
      throw new Error('No se recibió el mensaje de la cola');
    }

    const processingResult = await test.step(
      'Procesar el mensaje recibido',
      async () => {
        return await queueService.processMessage(receivedMessage);
      }
    );

    await test.step(
      'Verificar que el mensaje sea procesado correctamente',
      async () => {
        expect(processingResult).toBe('PROCESSED');
        expect(receivedMessage.processed).toBe(true);
      }
    );

    await test.step(
      'Verificar que no existan mensajes pendientes',
      async () => {
        expect(queueService.getPendingMessageCount()).toBe(0);
        expect(queueService.getProcessedMessageCount()).toBe(1);
      }
    );

    const duplicateResult = await test.step(
      'Intentar procesar nuevamente el mismo mensaje',
      async () => {
        return await queueService.processMessage(receivedMessage);
      }
    );

    await test.step(
      'Verificar que el segundo procesamiento sea identificado como duplicado',
      async () => {
        expect(duplicateResult).toBe('DUPLICATE');
      }
    );

    await test.step(
      'Verificar que el mensaje continúe contabilizado una sola vez',
      async () => {
        expect(queueService.getProcessedMessageCount()).toBe(1);
      }
    );
  });

});
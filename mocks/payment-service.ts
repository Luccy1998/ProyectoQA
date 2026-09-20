export interface PaymentNotification {
  trackingId: string;
  paymentId: string;
  idempotencyKey: string;
  amount: number;
}

export interface PaymentResult {
  status: 'PROCESSED' | 'DUPLICATE';
  httpStatus: number;
  chargeId: string;
  inventoryDeductionId: string;
  trackingId: string;
  trackingStatus: 'PAID';
  body: {
    trackingId: string;
    status: 'PAID' | 'ALREADY_PROCESSED';
    message: string;
  };
}

export class PaymentService {
  private processedKeys = new Set<string>();

  private charges = 0;
  private inventoryDeductions = 0;

  async processNotification(
    notification: PaymentNotification
  ): Promise<PaymentResult> {
    const { trackingId, idempotencyKey } = notification;

    if (this.processedKeys.has(idempotencyKey)) {
      return {
        status: 'DUPLICATE',
        httpStatus: 200,
        chargeId: `charge-${idempotencyKey}`,
        inventoryDeductionId: `inventory-${idempotencyKey}`,
        trackingId,
        trackingStatus: 'PAID',
        body: {
          trackingId,
          status: 'ALREADY_PROCESSED',
          message: 'La notificación ya fue procesada',
        },
      };
    }

    this.processedKeys.add(idempotencyKey);

    this.charges += 1;
    this.inventoryDeductions += 1;

    return {
      status: 'PROCESSED',
      httpStatus: 200,
      chargeId: `charge-${idempotencyKey}`,
      inventoryDeductionId: `inventory-${idempotencyKey}`,
      trackingId,
      trackingStatus: 'PAID',
      body: {
        trackingId,
        status: 'PAID',
        message: 'Pago procesado correctamente',
      },
    };
  }

  getChargeCount(): number {
    return this.charges;
  }

  getInventoryDeductionCount(): number {
    return this.inventoryDeductions;
  }
}
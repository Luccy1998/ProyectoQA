export interface QueueMessage {
  messageId: string;
  trackingId: string;
  idempotencyKey: string;
  type: 'PAYMENT_CONFIRMED';
  processed: boolean;
}

export class QueueService {
  private messages: QueueMessage[] = [];
  private processedMessageIds = new Set<string>();

  async sendMessage(
    message: Omit<QueueMessage, 'messageId' | 'processed'>
  ): Promise<QueueMessage> {
    const queueMessage: QueueMessage = {
      ...message,
      messageId: `MSG-${this.messages.length + 1}`,
      processed: false,
    };

    this.messages.push(queueMessage);

    return queueMessage;
  }

  async receiveMessage(): Promise<QueueMessage | undefined> {
    return this.messages.find(
      (message) => !message.processed
    );
  }

  async processMessage(
    message: QueueMessage
  ): Promise<'PROCESSED' | 'DUPLICATE'> {
    if (this.processedMessageIds.has(message.messageId)) {
      return 'DUPLICATE';
    }

    this.processedMessageIds.add(message.messageId);

    message.processed = true;

    return 'PROCESSED';
  }

  getProcessedMessageCount(): number {
    return this.processedMessageIds.size;
  }

  getPendingMessageCount(): number {
    return this.messages.filter(
      (message) => !message.processed
    ).length;
  }
}
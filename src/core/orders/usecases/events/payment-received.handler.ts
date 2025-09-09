import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { OrderStatus } from '../../entities/order-status';

export interface PaymentReceivedEventData {
  transactionCode: string;
  orderId: string;
  paidAt: Date;
  amountPaid: number;
}

export class PaymentReceivedEventHandler {
  static async handle(
    eventData: PaymentReceivedEventData,
    orderGateway: OrderGateway,
  ): Promise<void> {
    
    console.log(`Processando pagamento recebido: ${eventData.transactionCode}`);
    
    // Buscar pedido
    const order = await orderGateway.findById(eventData.orderId);
    if (!order) {
      throw new Error(`Order ${eventData.orderId} not found`);
    }

    // Verificar se pedido está em status válido para receber pagamento
    if (order.status.value !== 'pending') {
      throw new Error(`Cannot process payment for order ${eventData.orderId} with status '${order.status.value}'. Order must be 'pending' to receive payment.`);
    }

    // Verificar se valor pago está correto
    if (eventData.amountPaid < order.total) {
      throw new Error(`Payment amount (${eventData.amountPaid}) is less than order total (${order.total})`);
    }

    // Atualizar dados de pagamento no pedido
    order.setPaymentDetails(
      eventData.transactionCode,
      eventData.paidAt,
      eventData.amountPaid
    );

    // Atualizar status para 'received'
    order.status = new OrderStatus('received');

    // Salvar pedido atualizado
    await orderGateway.save(order);

    console.log(`Pedido ${eventData.orderId} marcado como pago e recebido`);
  }
}

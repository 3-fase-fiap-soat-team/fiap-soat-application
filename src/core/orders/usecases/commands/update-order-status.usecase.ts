import { Order } from '../../entities/order';
import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { OrderStatus } from '../../entities/order-status';

export interface UpdateOrderStatusDTO {
  orderId: string;
  newStatus: 'pending' | 'received' | 'preparing' | 'ready' | 'finished';
}

export class UpdateOrderStatusUseCase {
  static async execute(
    updateOrderStatusDto: UpdateOrderStatusDTO,
    orderGateway: OrderGateway,
  ): Promise<Order> {
    
    // Buscar ordem existente
    const existingOrder = await orderGateway.findById(updateOrderStatusDto.orderId);
    if (!existingOrder) {
      throw new Error('Order not found');
    }

    const currentStatus = existingOrder.status.value;
    const newStatus = updateOrderStatusDto.newStatus;

    // Validar transições de estado permitidas
    this.validateStatusTransition(currentStatus, newStatus);

    // Atualizar status
    existingOrder.status = new OrderStatus(newStatus);

    // Salvar ordem atualizada
    return await orderGateway.save(existingOrder);
  }

  private static validateStatusTransition(
    currentStatus: string,
    newStatus: string
  ): void {
    switch (newStatus) {
      case 'preparing':
        // Preparação só pode começar para pedidos 'received'
        if (currentStatus !== 'received') {
          throw new Error(`Cannot start preparation for order with status '${currentStatus}'. Order must be 'received' to start preparation.`);
        }
        break;

      case 'ready':
        // Só podemos finalizar os pedidos 'preparing'
        if (currentStatus !== 'preparing') {
          throw new Error(`Cannot mark order as ready with status '${currentStatus}'. Order must be 'preparing' to be marked as ready.`);
        }
        break;

      case 'finished':
        // Só podemos entregar os pedidos 'ready'
        if (currentStatus !== 'ready') {
          throw new Error(`Cannot deliver order with status '${currentStatus}'. Order must be 'ready' to be delivered.`);
        }
        break;

      case 'received':
        // Transição de 'pending' para 'received' via pagamento (webhook)
        if (currentStatus !== 'pending') {
          throw new Error(`Cannot mark order as received with status '${currentStatus}'. Order must be 'pending' to be received.`);
        }
        break;

      case 'pending':
        // Normalmente não permitimos voltar para pending, mas pode ser útil para testes
        break;

      default:
        throw new Error(`Invalid status transition: ${currentStatus} -> ${newStatus}`);
    }
  }
}

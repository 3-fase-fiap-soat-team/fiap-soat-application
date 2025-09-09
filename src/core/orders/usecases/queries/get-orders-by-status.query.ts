import { Order } from '../../entities/order';
import { OrderGateway } from '../../operation/gateways/orders-gateway';

export class GetOrdersByStatusQuery {
  static async execute(
    status: 'pending' | 'received' | 'preparing' | 'ready' | 'finished',
    orderGateway: OrderGateway,
  ): Promise<Order[]> {
    return await orderGateway.findByStatus(status);
  }
}

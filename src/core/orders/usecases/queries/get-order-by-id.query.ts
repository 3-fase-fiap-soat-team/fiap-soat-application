import { Order } from '../../entities/order';
import { OrderGateway } from '../../operation/gateways/orders-gateway';

export class GetOrderByIdQuery {
  static async execute(
    id: string,
    orderGateway: OrderGateway,
  ): Promise<Order | null> {
    return await orderGateway.findById(id);
  }
}

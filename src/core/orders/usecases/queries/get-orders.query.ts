import { Order } from '../../entities/order';
import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { OrderStatusFilter } from '../../enums/order-status-filter.enum';

export interface GetOrdersQueryParams {
  status?: OrderStatusFilter;
}

export class GetOrdersQuery {
  static async execute(
    params: GetOrdersQueryParams,
    orderGateway: OrderGateway,
  ): Promise<Order[]> {
    
    const requestedStatus = params.status || OrderStatusFilter.ALL;
    
    switch (requestedStatus) {
      case OrderStatusFilter.PENDING:
        // Pedidos aguardando pagamento
        return await orderGateway.findByStatus('pending');
        
      case OrderStatusFilter.RECEIVED:
        // Pedidos com pagamento confirmado, aguardando preparação
        return await orderGateway.findByStatus('received');
        
      case OrderStatusFilter.PREPARING:
        // Pedidos em preparação na cozinha
        return await orderGateway.findByStatus('preparing');
        
      case OrderStatusFilter.READY:
        // Pedidos prontos para entrega
        return await orderGateway.findByStatus('ready');
        
      case OrderStatusFilter.FINISHED:
        // Pedidos finalizados/entregues
        return await orderGateway.findByStatus('finished');
        
      case OrderStatusFilter.ALL:
        // Todos os pedidos
        return await orderGateway.findAll();
        
      default:
        return await orderGateway.findAll();
    }
  }
}

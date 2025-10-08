import { Order } from '../../entities/order';
import { OrderGateway } from '../../operation/gateways/orders-gateway';

export class GetKitchenOrdersQuery {
  static async execute(
    orderGateway: OrderGateway,
  ): Promise<Order[]> {
    // Kitchen orders conforme regras de negócio:
    // 1. Prioridade: ready > preparing > received
    // 2. Em cada status, ordenar do mais antigo para o mais novo (createdAt ASC)
    // 3. Exclui status finished e pending
    
    // Buscar pedidos ordenados por data de criação (mais antigo primeiro)
    const readyOrders = await orderGateway.findByStatus('ready');
    const preparingOrders = await orderGateway.findByStatus('preparing');
    const receivedOrders = await orderGateway.findByStatus('received');
    
    // Retornar na ordem de prioridade: ready primeiro, depois preparing, depois received
    // Como o findByStatus já ordena por createdAt ASC, mantemos a ordem dentro de cada status
    return [...readyOrders, ...preparingOrders, ...receivedOrders];
  }
}

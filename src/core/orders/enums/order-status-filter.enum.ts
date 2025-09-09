export enum OrderStatusFilter {
  PENDING = 'pending',
  RECEIVED = 'received',
  PREPARING = 'preparing', 
  READY = 'ready',
  FINISHED = 'finished',
  ALL = 'all'
}

export const ORDER_STATUS_DESCRIPTIONS = {
  [OrderStatusFilter.PENDING]: 'Pedidos aguardando pagamento',
  [OrderStatusFilter.RECEIVED]: 'Pedidos com pagamento confirmado',
  [OrderStatusFilter.PREPARING]: 'Pedidos em preparação na cozinha',
  [OrderStatusFilter.READY]: 'Pedidos prontos para entrega',
  [OrderStatusFilter.FINISHED]: 'Pedidos finalizados/entregues',
  [OrderStatusFilter.ALL]: 'Todos os pedidos'
};

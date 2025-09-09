import { GetOrdersQuery, GetOrdersQueryParams } from './get-orders.query';
import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { Order } from '../../entities/order';
import { OrderStatus } from '../../entities/order-status';
import { OrderStatusFilter } from '../../enums/order-status-filter.enum';

describe('GetOrdersQuery', () => {
  let mockOrderGateway: jest.Mocked<OrderGateway>;

  const createMockOrder = (orderId: string, status: 'pending' | 'received' | 'preparing' | 'ready' | 'finished'): Order => {
    const order = new Order(orderId);
    order.status = new OrderStatus(status);
    order.customerId = 'customer-123';
    return order;
  };

  beforeEach(() => {
    mockOrderGateway = {
      dataSource: {} as any,
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      refreshReadModel: jest.fn(),
    } as jest.Mocked<OrderGateway>;
  });

  describe('execute', () => {
    it('deve retornar todos os pedidos quando status for ALL', async () => {
      // Arrange
      const allOrders = [
        createMockOrder('order-1', 'pending'),
        createMockOrder('order-2', 'received'),
        createMockOrder('order-3', 'preparing'),
      ];
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.ALL };

      mockOrderGateway.findAll.mockResolvedValue(allOrders);

      // Act
      const result = await GetOrdersQuery.execute(params, mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findAll).toHaveBeenCalled();
      expect(mockOrderGateway.findByStatus).not.toHaveBeenCalled();
      expect(result).toBe(allOrders);
      expect(result).toHaveLength(3);
    });

    it('deve retornar todos os pedidos quando status não for fornecido (default ALL)', async () => {
      // Arrange
      const allOrders = [createMockOrder('order-1', 'ready')];
      const params: GetOrdersQueryParams = {};

      mockOrderGateway.findAll.mockResolvedValue(allOrders);

      // Act
      const result = await GetOrdersQuery.execute(params, mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findAll).toHaveBeenCalled();
      expect(result).toBe(allOrders);
    });

    it('deve retornar pedidos pendentes quando status for PENDING', async () => {
      // Arrange
      const pendingOrders = [createMockOrder('order-1', 'pending')];
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.PENDING };

      mockOrderGateway.findByStatus.mockResolvedValue(pendingOrders);

      // Act
      const result = await GetOrdersQuery.execute(params, mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('pending');
      expect(mockOrderGateway.findAll).not.toHaveBeenCalled();
      expect(result).toBe(pendingOrders);
    });

    it('deve retornar pedidos recebidos quando status for RECEIVED', async () => {
      // Arrange
      const receivedOrders = [createMockOrder('order-1', 'received')];
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.RECEIVED };

      mockOrderGateway.findByStatus.mockResolvedValue(receivedOrders);

      // Act
      const result = await GetOrdersQuery.execute(params, mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('received');
      expect(result).toBe(receivedOrders);
    });

    it('deve retornar pedidos em preparação quando status for PREPARING', async () => {
      // Arrange
      const preparingOrders = [createMockOrder('order-1', 'preparing')];
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.PREPARING };

      mockOrderGateway.findByStatus.mockResolvedValue(preparingOrders);

      // Act
      const result = await GetOrdersQuery.execute(params, mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('preparing');
      expect(result).toBe(preparingOrders);
    });

    it('deve retornar pedidos prontos quando status for READY', async () => {
      // Arrange
      const readyOrders = [createMockOrder('order-1', 'ready')];
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.READY };

      mockOrderGateway.findByStatus.mockResolvedValue(readyOrders);

      // Act
      const result = await GetOrdersQuery.execute(params, mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('ready');
      expect(result).toBe(readyOrders);
    });

    it('deve retornar pedidos finalizados quando status for FINISHED', async () => {
      // Arrange
      const finishedOrders = [createMockOrder('order-1', 'finished')];
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.FINISHED };

      mockOrderGateway.findByStatus.mockResolvedValue(finishedOrders);

      // Act
      const result = await GetOrdersQuery.execute(params, mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('finished');
      expect(result).toBe(finishedOrders);
    });

    it('deve retornar array vazio quando nenhum pedido é encontrado', async () => {
      // Arrange
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.PENDING };
      mockOrderGateway.findByStatus.mockResolvedValue([]);

      // Act
      const result = await GetOrdersQuery.execute(params, mockOrderGateway);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('deve propagar erro do gateway', async () => {
      // Arrange
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.ALL };
      mockOrderGateway.findAll.mockRejectedValue(new Error('Database connection error'));

      // Act & Assert
      await expect(
        GetOrdersQuery.execute(params, mockOrderGateway),
      ).rejects.toThrow('Database connection error');
    });

    it('deve propagar erro do gateway ao buscar por status específico', async () => {
      // Arrange
      const params: GetOrdersQueryParams = { status: OrderStatusFilter.PREPARING };
      mockOrderGateway.findByStatus.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        GetOrdersQuery.execute(params, mockOrderGateway),
      ).rejects.toThrow('Database error');
    });
  });
});

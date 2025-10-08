import { GetOrdersByStatusQuery } from './get-orders-by-status.query';
import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { Order } from '../../entities/order';
import { OrderStatus } from '../../entities/order-status';

describe('GetOrdersByStatusQuery', () => {
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
    it('deve retornar pedidos com status pending', async () => {
      // Arrange
      const mockOrder1 = createMockOrder('order-1', 'pending');
      const mockOrder2 = createMockOrder('order-2', 'pending');
      const expectedOrders = [mockOrder1, mockOrder2];

      mockOrderGateway.findByStatus.mockResolvedValue(expectedOrders);

      // Act
      const result = await GetOrdersByStatusQuery.execute('pending', mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('pending');
      expect(result).toBe(expectedOrders);
      expect(result).toHaveLength(2);
      expect(result[0].status.value).toBe('pending');
      expect(result[1].status.value).toBe('pending');
    });

    it('deve retornar pedidos com status preparing', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'preparing');
      const expectedOrders = [mockOrder];

      mockOrderGateway.findByStatus.mockResolvedValue(expectedOrders);

      // Act
      const result = await GetOrdersByStatusQuery.execute('preparing', mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('preparing');
      expect(result).toBe(expectedOrders);
      expect(result).toHaveLength(1);
      expect(result[0].status.value).toBe('preparing');
    });

    it('deve retornar array vazio quando nenhum pedido é encontrado', async () => {
      // Arrange
      mockOrderGateway.findByStatus.mockResolvedValue([]);

      // Act
      const result = await GetOrdersByStatusQuery.execute('finished', mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('finished');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('deve funcionar com diferentes status', async () => {
      // Arrange
      const receivedOrders = [createMockOrder('order-1', 'received')];
      const readyOrders = [createMockOrder('order-2', 'ready')];
      
      mockOrderGateway.findByStatus
        .mockResolvedValueOnce(receivedOrders)
        .mockResolvedValueOnce(readyOrders);

      // Act
      const receivedResult = await GetOrdersByStatusQuery.execute('received', mockOrderGateway);
      const readyResult = await GetOrdersByStatusQuery.execute('ready', mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findByStatus).toHaveBeenCalledTimes(2);
      expect(mockOrderGateway.findByStatus).toHaveBeenNthCalledWith(1, 'received');
      expect(mockOrderGateway.findByStatus).toHaveBeenNthCalledWith(2, 'ready');
      
      expect(receivedResult[0].status.value).toBe('received');
      expect(readyResult[0].status.value).toBe('ready');
    });

    it('deve propagar erro do gateway', async () => {
      // Arrange
      mockOrderGateway.findByStatus.mockRejectedValue(new Error('Database connection error'));

      // Act & Assert
      await expect(
        GetOrdersByStatusQuery.execute('pending', mockOrderGateway),
      ).rejects.toThrow('Database connection error');

      expect(mockOrderGateway.findByStatus).toHaveBeenCalledWith('pending');
    });

    it('deve trabalhar com múltiplos pedidos do mesmo status', async () => {
      // Arrange
      const orders = [
        createMockOrder('order-1', 'ready'),
        createMockOrder('order-2', 'ready'),
        createMockOrder('order-3', 'ready'),
      ];

      mockOrderGateway.findByStatus.mockResolvedValue(orders);

      // Act
      const result = await GetOrdersByStatusQuery.execute('ready', mockOrderGateway);

      // Assert
      expect(result).toHaveLength(3);
      expect(result.every(order => order.status.value === 'ready')).toBe(true);
    });
  });
});

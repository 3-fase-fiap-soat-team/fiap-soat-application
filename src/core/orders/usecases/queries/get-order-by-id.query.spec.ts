import { GetOrderByIdQuery } from './get-order-by-id.query';
import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { Order } from '../../entities/order';
import { OrderStatus } from '../../entities/order-status';

describe('GetOrderByIdQuery', () => {
  let mockOrderGateway: jest.Mocked<OrderGateway>;

  const createMockOrder = (orderId: string): Order => {
    const order = new Order(orderId);
    order.status = new OrderStatus('pending');
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
    it('deve retornar o pedido quando encontrado', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123');
      mockOrderGateway.findById.mockResolvedValue(mockOrder);

      // Act
      const result = await GetOrderByIdQuery.execute('order-123', mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findById).toHaveBeenCalledWith('order-123');
      expect(result).toBe(mockOrder);
      expect(result?.id).toBe('order-123');
    });

    it('deve retornar null quando pedido não é encontrado', async () => {
      // Arrange
      mockOrderGateway.findById.mockResolvedValue(null);

      // Act
      const result = await GetOrderByIdQuery.execute('order-nonexistent', mockOrderGateway);

      // Assert
      expect(mockOrderGateway.findById).toHaveBeenCalledWith('order-nonexistent');
      expect(result).toBeNull();
    });

    it('deve propagar erro do gateway', async () => {
      // Arrange
      mockOrderGateway.findById.mockRejectedValue(new Error('Database connection error'));

      // Act & Assert
      await expect(
        GetOrderByIdQuery.execute('order-123', mockOrderGateway),
      ).rejects.toThrow('Database connection error');

      expect(mockOrderGateway.findById).toHaveBeenCalledWith('order-123');
    });

    it('deve trabalhar com diferentes IDs', async () => {
      // Arrange
      const mockOrder1 = createMockOrder('order-1');
      const mockOrder2 = createMockOrder('order-2');

      mockOrderGateway.findById
        .mockResolvedValueOnce(mockOrder1)
        .mockResolvedValueOnce(mockOrder2);

      // Act
      const result1 = await GetOrderByIdQuery.execute('order-1', mockOrderGateway);
      const result2 = await GetOrderByIdQuery.execute('order-2', mockOrderGateway);

      // Assert
      expect(result1?.id).toBe('order-1');
      expect(result2?.id).toBe('order-2');
      expect(mockOrderGateway.findById).toHaveBeenCalledTimes(2);
    });
  });
});

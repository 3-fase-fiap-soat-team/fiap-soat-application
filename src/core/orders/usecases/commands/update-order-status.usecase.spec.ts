import { UpdateOrderStatusUseCase, UpdateOrderStatusDTO } from './update-order-status.usecase';
import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { Order } from '../../entities/order';
import { OrderStatus } from '../../entities/order-status';

describe('UpdateOrderStatusUseCase', () => {
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
    it('deve atualizar status de pending para received com sucesso', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'pending');
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-123',
        newStatus: 'received',
      };

      mockOrderGateway.findById.mockResolvedValue(mockOrder);
      mockOrderGateway.save.mockResolvedValue(mockOrder);

      // Act
      const result = await UpdateOrderStatusUseCase.execute(
        updateOrderStatusDto,
        mockOrderGateway,
      );

      // Assert
      expect(mockOrderGateway.findById).toHaveBeenCalledWith('order-123');
      expect(mockOrder.status.value).toBe('received');
      expect(mockOrderGateway.save).toHaveBeenCalledWith(mockOrder);
      expect(result).toBe(mockOrder);
    });

    it('deve atualizar status de received para preparing com sucesso', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'received');
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-123',
        newStatus: 'preparing',
      };

      mockOrderGateway.findById.mockResolvedValue(mockOrder);
      mockOrderGateway.save.mockResolvedValue(mockOrder);

      // Act
      const result = await UpdateOrderStatusUseCase.execute(
        updateOrderStatusDto,
        mockOrderGateway,
      );

      // Assert
      expect(mockOrder.status.value).toBe('preparing');
      expect(result).toBe(mockOrder);
    });

    it('deve atualizar status de preparing para ready com sucesso', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'preparing');
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-123',
        newStatus: 'ready',
      };

      mockOrderGateway.findById.mockResolvedValue(mockOrder);
      mockOrderGateway.save.mockResolvedValue(mockOrder);

      // Act
      const result = await UpdateOrderStatusUseCase.execute(
        updateOrderStatusDto,
        mockOrderGateway,
      );

      // Assert
      expect(mockOrder.status.value).toBe('ready');
      expect(result).toBe(mockOrder);
    });

    it('deve atualizar status de ready para finished com sucesso', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'ready');
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-123',
        newStatus: 'finished',
      };

      mockOrderGateway.findById.mockResolvedValue(mockOrder);
      mockOrderGateway.save.mockResolvedValue(mockOrder);

      // Act
      const result = await UpdateOrderStatusUseCase.execute(
        updateOrderStatusDto,
        mockOrderGateway,
      );

      // Assert
      expect(mockOrder.status.value).toBe('finished');
      expect(result).toBe(mockOrder);
    });

    it('deve lançar erro quando pedido não é encontrado', async () => {
      // Arrange
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-nonexistent',
        newStatus: 'received',
      };

      mockOrderGateway.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        UpdateOrderStatusUseCase.execute(
          updateOrderStatusDto,
          mockOrderGateway,
        ),
      ).rejects.toThrow('Order not found');

      expect(mockOrderGateway.findById).toHaveBeenCalledWith('order-nonexistent');
      expect(mockOrderGateway.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro ao tentar mudar de pending para preparing (transição inválida)', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'pending');
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-123',
        newStatus: 'preparing',
      };

      mockOrderGateway.findById.mockResolvedValue(mockOrder);

      // Act & Assert
      await expect(
        UpdateOrderStatusUseCase.execute(
          updateOrderStatusDto,
          mockOrderGateway,
        ),
      ).rejects.toThrow("Cannot start preparation for order with status 'pending'. Order must be 'received' to start preparation.");

      expect(mockOrderGateway.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro ao tentar mudar de pending para ready (transição inválida)', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'pending');
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-123',
        newStatus: 'ready',
      };

      mockOrderGateway.findById.mockResolvedValue(mockOrder);

      // Act & Assert
      await expect(
        UpdateOrderStatusUseCase.execute(
          updateOrderStatusDto,
          mockOrderGateway,
        ),
      ).rejects.toThrow("Cannot mark order as ready with status 'pending'. Order must be 'preparing' to be marked as ready.");

      expect(mockOrderGateway.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro ao tentar mudar de received para finished (transição inválida)', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'received');
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-123',
        newStatus: 'finished',
      };

      mockOrderGateway.findById.mockResolvedValue(mockOrder);

      // Act & Assert
      await expect(
        UpdateOrderStatusUseCase.execute(
          updateOrderStatusDto,
          mockOrderGateway,
        ),
      ).rejects.toThrow("Cannot deliver order with status 'received'. Order must be 'ready' to be delivered.");

      expect(mockOrderGateway.save).not.toHaveBeenCalled();
    });

    it('deve tratar erro durante salvamento', async () => {
      // Arrange
      const mockOrder = createMockOrder('order-123', 'pending');
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: 'order-123',
        newStatus: 'received',
      };

      mockOrderGateway.findById.mockResolvedValue(mockOrder);
      mockOrderGateway.save.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        UpdateOrderStatusUseCase.execute(
          updateOrderStatusDto,
          mockOrderGateway,
        ),
      ).rejects.toThrow('Database error');
    });
  });
});

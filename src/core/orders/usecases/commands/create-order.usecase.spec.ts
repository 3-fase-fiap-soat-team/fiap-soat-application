import { CreateOrderUseCase, CreateOrderDTO } from './create-order.usecase';
import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { ProductGateway } from 'src/core/products/operation/gateways/product-gateway';
import { OrderFactory } from '../../entities/factories/orders.factory';
import { Order } from '../../entities/order';
import { Product } from 'src/core/products/entities/product';
import { ProductStock } from 'src/core/products/entities/value-objects/product-stock';
import { OrderStatus } from '../../entities/order-status';

describe('CreateOrderUseCase', () => {
  let mockOrderGateway: jest.Mocked<OrderGateway>;
  let mockProductGateway: jest.Mocked<ProductGateway>;
  let mockOrderFactory: jest.Mocked<OrderFactory>;

  const mockProduct1 = new Product(
    'product-1',
    'Product 1',
    'Description 1',
    10.00,
    'category-1',
    new ProductStock(100),
    'image1.jpg',
    new Date(),
    new Date(),
  );

  const mockProduct2 = new Product(
    'product-2',
    'Product 2',
    'Description 2',
    15.00,
    'category-2',
    new ProductStock(50),
    'image2.jpg',
    new Date(),
    new Date(),
  );

  const mockOrder = new Order('order-123');

  beforeEach(() => {
    // Configurar status inicial do mock order
    mockOrder.status = new OrderStatus('pending');
    mockOrder.customerId = 'customer-123';

    mockOrderGateway = {
      dataSource: {} as any,
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      refreshReadModel: jest.fn(),
    } as jest.Mocked<OrderGateway>;

    mockProductGateway = {
      dataSource: {} as any,
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      findManyByIds: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ProductGateway>;

    mockOrderFactory = {
      create: jest.fn(),
    } as jest.Mocked<OrderFactory>;
  });

  describe('execute', () => {
    it('deve criar um pedido com sucesso', async () => {
      // Arrange
      const createOrderDto: CreateOrderDTO = {
        customerId: 'customer-123',
        items: [
          { productId: 'product-1', quantity: 2 },
          { productId: 'product-2', quantity: 1 },
        ],
      };

      mockProductGateway.findManyByIds.mockResolvedValue([mockProduct1, mockProduct2]);
      mockOrderFactory.create.mockReturnValue(mockOrder);
      mockOrderGateway.save.mockResolvedValue(mockOrder);

      // Act
      const result = await CreateOrderUseCase.execute(
        createOrderDto,
        mockOrderGateway,
        mockProductGateway,
        mockOrderFactory,
      );

      // Assert
      expect(mockProductGateway.findManyByIds).toHaveBeenCalledWith(['product-1', 'product-2']);
      expect(mockOrderFactory.create).toHaveBeenCalledWith('customer-123', [
        {
          product: mockProduct1,
          quantity: 2,
          categoryName: 'category-1',
        },
        {
          product: mockProduct2,
          quantity: 1,
          categoryName: 'category-2',
        },
      ]);
      expect(mockOrderGateway.save).toHaveBeenCalledWith(mockOrder);
      expect(result).toBe(mockOrder);
    });

    it('deve criar um pedido sem customerId (cliente anônimo)', async () => {
      // Arrange
      const createOrderDto: CreateOrderDTO = {
        items: [
          { productId: 'product-1', quantity: 1 },
        ],
      };

      mockProductGateway.findManyByIds.mockResolvedValue([mockProduct1]);
      mockOrderFactory.create.mockReturnValue(mockOrder);
      mockOrderGateway.save.mockResolvedValue(mockOrder);

      // Act
      const result = await CreateOrderUseCase.execute(
        createOrderDto,
        mockOrderGateway,
        mockProductGateway,
        mockOrderFactory,
      );

      // Assert
      expect(mockOrderFactory.create).toHaveBeenCalledWith(undefined, [
        {
          product: mockProduct1,
          quantity: 1,
          categoryName: 'category-1',
        },
      ]);
      expect(result).toBe(mockOrder);
    });

    it('deve lançar erro quando produto não é encontrado', async () => {
      // Arrange
      const createOrderDto: CreateOrderDTO = {
        customerId: 'customer-123',
        items: [
          { productId: 'product-1', quantity: 2 },
          { productId: 'product-nonexistent', quantity: 1 },
        ],
      };

      // Simula que apenas um produto foi encontrado
      mockProductGateway.findManyByIds.mockResolvedValue([mockProduct1]);

      // Act & Assert
      await expect(
        CreateOrderUseCase.execute(
          createOrderDto,
          mockOrderGateway,
          mockProductGateway,
          mockOrderFactory,
        ),
      ).rejects.toThrow('One or more products not found');

      expect(mockProductGateway.findManyByIds).toHaveBeenCalledWith(['product-1', 'product-nonexistent']);
      expect(mockOrderFactory.create).not.toHaveBeenCalled();
      expect(mockOrderGateway.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando nenhum produto é encontrado', async () => {
      // Arrange
      const createOrderDto: CreateOrderDTO = {
        customerId: 'customer-123',
        items: [
          { productId: 'product-nonexistent', quantity: 1 },
        ],
      };

      mockProductGateway.findManyByIds.mockResolvedValue([]);

      // Act & Assert
      await expect(
        CreateOrderUseCase.execute(
          createOrderDto,
          mockOrderGateway,
          mockProductGateway,
          mockOrderFactory,
        ),
      ).rejects.toThrow('One or more products not found');
    });

    it('deve tratar erro durante salvamento', async () => {
      // Arrange
      const createOrderDto: CreateOrderDTO = {
        customerId: 'customer-123',
        items: [
          { productId: 'product-1', quantity: 1 },
        ],
      };

      mockProductGateway.findManyByIds.mockResolvedValue([mockProduct1]);
      mockOrderFactory.create.mockReturnValue(mockOrder);
      mockOrderGateway.save.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        CreateOrderUseCase.execute(
          createOrderDto,
          mockOrderGateway,
          mockProductGateway,
          mockOrderFactory,
        ),
      ).rejects.toThrow('Database error');
    });
  });
});

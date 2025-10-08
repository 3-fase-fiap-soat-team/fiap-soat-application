import { GetAllProductsQuery } from './get-all-products.query';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('GetAllProductsQuery', () => {
  let mockProductGateway: jest.Mocked<ProductGateway>;

  const mockProducts: Product[] = [
    new Product(
      'product-1',
      'Product 1',
      'Description 1',
      99.99,
      'category-1',
      new ProductStock(10),
      'https://example.com/image1.jpg',
      new Date(),
      new Date(),
    ),
    new Product(
      'product-2',
      'Product 2',
      'Description 2',
      149.99,
      'category-2',
      new ProductStock(5),
      'https://example.com/image2.jpg',
      new Date(),
      new Date(),
    ),
  ];

  beforeEach(() => {
    mockProductGateway = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ProductGateway>;
  });

  describe('execute', () => {
    it('deve retornar todos os produtos', async () => {
      // Arrange
      mockProductGateway.findAll.mockResolvedValue(mockProducts);

      // Act
      const result = await GetAllProductsQuery.execute(mockProductGateway);

      // Assert
      expect(mockProductGateway.findAll).toHaveBeenCalled();
      expect(result).toBe(mockProducts);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no products exist', async () => {
      // Arrange
      mockProductGateway.findAll.mockResolvedValue([]);

      // Act
      const result = await GetAllProductsQuery.execute(mockProductGateway);

      // Assert
      expect(mockProductGateway.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});

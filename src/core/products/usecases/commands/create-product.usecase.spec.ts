import { CreateProductUseCase } from './create-product.usecase';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { CategoryGateway } from 'src/core/categories/operation/gateways/categories-gateway';
import { ProductFactory } from '../../entities/factories/product.factory';
import { NewProductDTO } from 'src/core/common/dtos/new-product.dto';
import { Product } from '../../entities/product';
import { Category } from 'src/core/categories/entities/category';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('CreateProductUseCase', () => {
  let mockProductGateway: jest.Mocked<ProductGateway>;
  let mockCategoryGateway: jest.Mocked<CategoryGateway>;
  let mockProductFactory: jest.Mocked<ProductFactory>;

  const mockCategory = new Category('category-123', 'Test Category');
  const mockProduct = new Product(
    'product-123',
    'Test Product',
    'Test Description',
    99.99,
    'category-123',
    new ProductStock(10),
    'https://example.com/image.jpg',
    new Date(),
    new Date(),
  );

  const newProductDTO: NewProductDTO = {
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    categoryId: 'category-123',
    stock: 10,
    image: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    mockProductGateway = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ProductGateway>;

    mockCategoryGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<CategoryGateway>;

    mockProductFactory = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ProductFactory>;
  });

  describe('execute', () => {
    it('deve criar produto com sucesso quando categoria existe', async () => {
      // Arrange
      mockCategoryGateway.findById.mockResolvedValue(mockCategory);
      mockProductFactory.create.mockReturnValue(mockProduct);
      mockProductGateway.save.mockResolvedValue(mockProduct);

      // Act
      const result = await CreateProductUseCase.execute(
        newProductDTO,
        mockCategoryGateway,
        mockProductGateway,
        mockProductFactory,
      );

      // Assert
      expect(mockCategoryGateway.findById).toHaveBeenCalledWith(newProductDTO.categoryId);
      expect(mockProductFactory.create).toHaveBeenCalledWith(
        newProductDTO.name,
        newProductDTO.description,
        newProductDTO.price,
        newProductDTO.categoryId,
        newProductDTO.stock,
        newProductDTO.image,
      );
      expect(mockProductGateway.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toBe(mockProduct);
    });

    it('deve lançar erro quando categoria não existir', async () => {
      // Arrange
      mockCategoryGateway.findById.mockResolvedValue(null as unknown as Category);

      // Act & Assert
      await expect(
        CreateProductUseCase.execute(
          newProductDTO,
          mockCategoryGateway,
          mockProductGateway,
          mockProductFactory,
        ),
      ).rejects.toThrow('Category not found');

      expect(mockCategoryGateway.findById).toHaveBeenCalledWith(newProductDTO.categoryId);
      expect(mockProductFactory.create).not.toHaveBeenCalled();
      expect(mockProductGateway.save).not.toHaveBeenCalled();
    });
  });
});

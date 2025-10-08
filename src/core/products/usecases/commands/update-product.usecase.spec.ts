import { UpdateProductUseCase, UpdateProductDTO } from './update-product.usecase';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { CategoryGateway } from 'src/core/categories/operation/gateways/categories-gateway';
import { Product } from '../../entities/product';
import { Category } from 'src/core/categories/entities/category';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('UpdateProductUseCase', () => {
  let mockProductGateway: jest.Mocked<ProductGateway>;
  let mockCategoryGateway: jest.Mocked<CategoryGateway>;

  const existingProduct = new Product(
    'product-123',
    'Original Product',
    'Original Description',
    99.99,
    'category-123',
    new ProductStock(10),
    'https://example.com/original.jpg',
    new Date(),
    new Date(),
  );

  const mockCategory = new Category('category-456', 'New Category');

  beforeEach(() => {
    mockProductGateway = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ProductGateway>;

    mockCategoryGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<CategoryGateway>;
  });

  describe('execute', () => {
    it('deve atualizar produto com sucesso', async () => {
      // Arrange
      const updateData: UpdateProductDTO = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 149.99,
        stock: 20,
        image: 'https://example.com/updated.jpg',
      };

      mockProductGateway.findById.mockResolvedValue(existingProduct);
      mockProductGateway.save.mockResolvedValue(existingProduct);

      // Act
      const result = await UpdateProductUseCase.execute(
        mockProductGateway,
        mockCategoryGateway,
        'product-123',
        updateData,
      );

      // Assert
      expect(mockProductGateway.findById).toHaveBeenCalledWith('product-123');
      expect(mockProductGateway.save).toHaveBeenCalledWith(existingProduct);
      expect(result).toBe(existingProduct);
    });

    it('deve lançar erro quando produto não for encontrado', async () => {
      // Arrange
      const updateData: UpdateProductDTO = {
        name: 'Updated Product',
      };

      mockProductGateway.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        UpdateProductUseCase.execute(
          mockProductGateway,
          mockCategoryGateway,
          'nonexistent-id',
          updateData,
        ),
      ).rejects.toThrow('Product not found');

      expect(mockProductGateway.findById).toHaveBeenCalledWith('nonexistent-id');
      expect(mockProductGateway.save).not.toHaveBeenCalled();
    });

    it('deve validar categoria quando categoryId está sendo atualizado', async () => {
      // Arrange
      const updateData: UpdateProductDTO = {
        categoryId: 'category-456',
      };

      mockProductGateway.findById.mockResolvedValue(existingProduct);
      mockCategoryGateway.findById.mockResolvedValue(mockCategory);
      mockProductGateway.save.mockResolvedValue(existingProduct);

      // Act
      await UpdateProductUseCase.execute(
        mockProductGateway,
        mockCategoryGateway,
        'product-123',
        updateData,
      );

      // Assert
      expect(mockCategoryGateway.findById).toHaveBeenCalledWith('category-456');
      expect(mockProductGateway.save).toHaveBeenCalled();
    });

    it('deve lançar erro quando nova categoria não é encontrada', async () => {
      // Arrange
      const updateData: UpdateProductDTO = {
        categoryId: 'nonexistent-category',
      };

      mockProductGateway.findById.mockResolvedValue(existingProduct);
      mockCategoryGateway.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        UpdateProductUseCase.execute(
          mockProductGateway,
          mockCategoryGateway,
          'product-123',
          updateData,
        ),
      ).rejects.toThrow('Category not found');

      expect(mockCategoryGateway.findById).toHaveBeenCalledWith('nonexistent-category');
      expect(mockProductGateway.save).not.toHaveBeenCalled();
    });
  });
});

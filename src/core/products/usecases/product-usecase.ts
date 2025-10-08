import { NewProductDTO } from 'src/core/common/dtos/new-product.dto';
import { Product } from '../entities/product';
import { ProductGateway } from '../operation/gateways/product-gateway';
import { CategoryGateway } from 'src/core/categories/operation/gateways/categories-gateway';
import { ProductFactory } from '../entities/factories/product.factory';

// Commands
import { CreateProductUseCase } from './commands/create-product.usecase';
import { UpdateProductUseCase, UpdateProductDTO } from './commands/update-product.usecase';
import { DeleteProductUseCase } from './commands/delete-product.usecase';

// Queries
import { GetAllProductsQuery } from './queries/get-all-products.query';
import { GetProductByIdQuery } from './queries/get-product-by-id.query';
import { GetProductsByCategoryQuery } from './queries/get-products-by-category.query';

// Re-export interface for compatibility
export { UpdateProductDTO };

/**
 * Facade class that orchestrates product use cases following CQRS pattern.
 * Each operation delegates to specific Command or Query classes, ensuring
 * Single Responsibility Principle compliance.
 */
export class ProductUseCase {
  // Query operations
  static async findAll(productGateway: ProductGateway): Promise<Product[]> {
    return GetAllProductsQuery.execute(productGateway);
  }

  static async findById(productGateway: ProductGateway, id: string): Promise<Product | null> {
    return GetProductByIdQuery.execute(productGateway, id);
  }

  static async findByCategory(
    productGateway: ProductGateway,
    categoryId: string,
  ): Promise<Product[]> {
    return GetProductsByCategoryQuery.execute(productGateway, categoryId);
  }

  // Command operations
  static async save(
    product: NewProductDTO,
    categoryGateway: CategoryGateway,
    productGateway: ProductGateway,
    factory: ProductFactory,
  ): Promise<Product> {
    return CreateProductUseCase.execute(product, categoryGateway, productGateway, factory);
  }

  static async update(
    productGateway: ProductGateway,
    categoryGateway: CategoryGateway,
    id: string,
    updateData: UpdateProductDTO,
  ): Promise<Product> {
    return UpdateProductUseCase.execute(productGateway, categoryGateway, id, updateData);
  }

  static async delete(productGateway: ProductGateway, id: string): Promise<void> {
    return DeleteProductUseCase.execute(productGateway, id);
  }
}

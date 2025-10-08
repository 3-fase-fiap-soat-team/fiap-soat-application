import { NewProductDTO } from 'src/core/common/dtos/new-product.dto';
import { Product } from '../../entities/product';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { CategoryGateway } from 'src/core/categories/operation/gateways/categories-gateway';
import { ProductFactory } from '../../entities/factories/product.factory';

export class CreateProductUseCase {
  static async execute(
    product: NewProductDTO,
    categoryGateway: CategoryGateway,
    productGateway: ProductGateway,
    factory: ProductFactory,
  ): Promise<Product> {
    const category = await categoryGateway.findById(product.categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    const newProduct = factory.create(
      product.name,
      product.description,
      product.price,
      product.categoryId,
      product.stock,
      product.image,
    );

    return await productGateway.save(newProduct);
  }
}

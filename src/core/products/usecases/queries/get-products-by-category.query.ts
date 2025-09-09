import { Product } from '../../entities/product';
import { ProductGateway } from '../../operation/gateways/product-gateway';

export class GetProductsByCategoryQuery {
  static async execute(
    productGateway: ProductGateway,
    categoryId: string,
  ): Promise<Product[]> {
    return await productGateway.findByCategory(categoryId);
  }
}

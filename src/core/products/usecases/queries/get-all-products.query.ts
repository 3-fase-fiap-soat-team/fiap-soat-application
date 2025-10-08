import { Product } from '../../entities/product';
import { ProductGateway } from '../../operation/gateways/product-gateway';

export class GetAllProductsQuery {
  static async execute(productGateway: ProductGateway): Promise<Product[]> {
    return await productGateway.findAll();
  }
}

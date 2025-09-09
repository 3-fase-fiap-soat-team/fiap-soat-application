import { Product } from '../../entities/product';
import { ProductGateway } from '../../operation/gateways/product-gateway';

export class GetProductByIdQuery {
  static async execute(productGateway: ProductGateway, id: string): Promise<Product | null> {
    return await productGateway.findById(id);
  }
}

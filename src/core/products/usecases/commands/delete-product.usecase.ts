import { ProductGateway } from '../../operation/gateways/product-gateway';

export class DeleteProductUseCase {
  static async execute(productGateway: ProductGateway, id: string): Promise<void> {
    const product = await productGateway.findById(id);
    
    if (!product) {
      throw new Error('Product not found');
    }

    await productGateway.delete(id);
  }
}

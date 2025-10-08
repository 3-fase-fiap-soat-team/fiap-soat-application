import { ProductIdDTO } from 'src/core/common/dtos/product-id.dto';
import { Product } from '../../entities/product';

export class ProductIdPresenter {
  static toDTO(products: Product): ProductIdDTO {
    const productIdDTO: ProductIdDTO = { id: products.id };
    return productIdDTO;
  }
}

import { Product } from '../../entities/product';
import { ProductDTO } from 'src/core/common/dtos/product.dto';

export class ProductPresenter {
  static toDTO(products: Product[]): ProductDTO[] {
    if (products) {
      const productsDTO: ProductDTO[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock.value,
        image: product.image,
      }));
      return productsDTO;
    } else {
      return [];
    }
  }
}

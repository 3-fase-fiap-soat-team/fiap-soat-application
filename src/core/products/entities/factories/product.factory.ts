import { IdGenerator } from 'src/interfaces/id-generator';
import { Product } from '../product';
import { ProductStock } from '../value-objects/product-stock';
export class ProductFactory {
  constructor(private readonly idGenerator: IdGenerator) {}
  create(
    name: string,
    description: string,
    price: number,
    categoryId: string,
    stock: number,
    image: string,
  ): Product {
    const stockVO = new ProductStock(stock);
    const now = new Date();

    return new Product(
      this.idGenerator.generate(),
      name,
      description,
      price,
      categoryId,
      stockVO,
      image,
      now,
      now
    );
  }
}

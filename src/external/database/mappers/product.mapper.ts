import { ProductStock } from 'src/core/products/entities/value-objects/product-stock';
import { ProductEntity } from '../entities/product.entity';
import { Product } from 'src/core/products/entities/product';

export class ProductMapper {
  static toDomain(productEntity: ProductEntity): Product {
    const productStock = new ProductStock(productEntity.stock);
    
    // Convert JSON image object to string if it exists
    let imageString = '';
    if (productEntity.image && typeof productEntity.image === 'object') {
      const imageObj = productEntity.image as { url: string; alt: string };
      imageString = imageObj.url || '';
    } else if (typeof productEntity.image === 'string') {
      imageString = productEntity.image;
    }

    return new Product(
      productEntity.id,
      productEntity.name,
      productEntity.description,
      Number(productEntity.price),
      productEntity.category_id,
      productStock,
      imageString,
      productEntity.createdAt,
      productEntity.updatedAt
    );
  }

  static toPersistence(product: Product): ProductEntity {
    const entity = new ProductEntity();

    entity.id = product.id;
    entity.name = product.name;
    entity.description = product.description;
    entity.price = product.price;
    entity.category_id = product.categoryId;
    entity.stock = product.stock.value;
    entity.createdAt = product.createdAt;
    entity.updatedAt = product.updatedAt;
    
    // Convert string image to JSON object format for database
    if (product.image && product.image.trim() !== '') {
      entity.image = {
        url: product.image,
        alt: 'Product Image'
      };
    } else {
      entity.image = null;
    }
    
    return entity;
  }
}

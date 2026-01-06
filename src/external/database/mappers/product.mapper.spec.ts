import { ProductMapper } from './product.mapper';
import { ProductEntity } from '../entities/product.entity';
import { Product } from 'src/core/products/entities/product';
import { ProductStock } from 'src/core/products/entities/value-objects/product-stock';

describe('ProductMapper', () => {
  it('toDomain should map entity with image object to Product', () => {
    const entity = new ProductEntity();
    entity.id = 'p1';
    entity.name = 'Name';
    entity.description = 'D';
    entity.price = 10;
    entity.category_id = 'c1';
    entity.stock = 3;
    entity.image = { url: 'img.jpg', alt: 'a' } as any;
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    const product = ProductMapper.toDomain(entity);
    expect(product.id).toBe('p1');
    expect(product.stock.value).toBe(3);
    expect(product.image).toBe('img.jpg');
  });

  it('toDomain should handle string image', () => {
    const entity = new ProductEntity();
    entity.id = 'p2';
    entity.name = 'Name';
    entity.description = 'D';
    entity.price = 10;
    entity.category_id = 'c1';
    entity.stock = 1;
    entity.image = 'img2.jpg' as any;
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    const product = ProductMapper.toDomain(entity);
    expect(product.image).toBe('img2.jpg');
  });

  it('toPersistence should map product to entity with json image', () => {
    const product = new Product('p3', 'N', 'D', 5, 'c2', new ProductStock(2), 'imgx', new Date(), new Date());
    const entity = ProductMapper.toPersistence(product);
    expect(entity.category_id).toBe('c2');
    expect((entity.image as any).url).toBe('imgx');
  });
});

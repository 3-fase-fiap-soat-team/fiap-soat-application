import { ProductPresenter } from './product-presenter';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('ProductPresenter', () => {
  it('toDTO should map products array to DTOs', () => {
    const products: Product[] = [
      new Product('p1', 'Name', 'Desc', 10, 'c1', new ProductStock(5), 'img.jpg', new Date(), new Date()),
    ];

    const dto = ProductPresenter.toDTO(products);

    expect(Array.isArray(dto)).toBe(true);
    expect(dto[0].id).toBe('p1');
    expect(dto[0].stock).toBe(5);
    expect(dto[0].image).toBe('img.jpg');
  });

  it('toDTO should return empty array when input is falsy', () => {
    // @ts-ignore
    expect(ProductPresenter.toDTO(null)).toEqual([]);
  });
});

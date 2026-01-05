import { ProductIdPresenter } from './product-id-presenter';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('ProductIdPresenter', () => {
  it('toDTO should return id object', () => {
    const product = new Product('p1', 'Name', 'Desc', 10, 'c1', new ProductStock(0), '', new Date(), new Date());
    const dto = ProductIdPresenter.toDTO(product);
    expect(dto).toEqual({ id: 'p1' });
  });
});

import { CustomerIdPresenter } from './customer-id-presenter';
import { Customer } from '../../entities/customer';

describe('CustomerIdPresenter', () => {
  it('toDTO should return id dto', () => {
    const customer = new Customer('c1', 'John', 'a@b.com', '123', new Date(), new Date());
    const dto = CustomerIdPresenter.toDTO(customer);
    expect(dto).toEqual({ id: 'c1' });
  });
});

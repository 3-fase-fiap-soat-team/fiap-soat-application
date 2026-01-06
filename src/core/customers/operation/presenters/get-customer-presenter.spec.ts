import { GetCustomerPresenter } from './get-customer-presenter';
import { Customer } from '../../entities/customer';

describe('GetCustomerPresenter', () => {
  it('toDTO should map a customer to dto', () => {
    const customer = new Customer('c1', 'John', 'a@b.com', '123', new Date(), new Date());
    const dto = GetCustomerPresenter.toDTO(customer);
    expect(dto).toEqual({ id: 'c1', name: 'John', email: 'a@b.com', cpf: '123' });
  });
});

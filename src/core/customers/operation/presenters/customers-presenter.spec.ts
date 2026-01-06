import { CustomersPresenter } from './customers-presenter';
import { Customer } from '../../entities/customer';

describe('CustomersPresenter', () => {
  it('toDTO should map customers to dtos', () => {
    const customers = [new Customer('c1', 'John', 'a@b.com', '123', new Date(), new Date())];
    const dto = CustomersPresenter.toDTO(customers);
    expect(dto[0]).toEqual({ id: 'c1', name: 'John', email: 'a@b.com', cpf: '123' });
  });

  it('toDTO should return empty array when input is falsy', () => {
    // @ts-ignore
    expect(CustomersPresenter.toDTO(null)).toEqual([]);
  });
});

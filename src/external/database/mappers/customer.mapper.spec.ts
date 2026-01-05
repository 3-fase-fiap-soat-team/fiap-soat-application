import { CustomerMapper } from './customer.mapper';
import { CustomerEntity } from '../entities/customer.entity';
import { Customer } from 'src/core/customers/entities/customer';

describe('CustomerMapper', () => {
  it('toDomain maps persistence to domain', () => {
    const entity = new CustomerEntity();
    entity.id = 'c1';
    entity.name = 'John';
    entity.email = 'a@b.com';
    entity.cpf = '123';
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    const domain = CustomerMapper.toDomain(entity);
    expect(domain.id).toBe('c1');
    expect(domain.email).toBe('a@b.com');
  });

  it('toPersistence maps domain to entity', () => {
    const domain = new Customer('c2', 'Jane', 'j@k.com', '456', new Date(), new Date());
    const entity = CustomerMapper.toPersistence(domain);
    expect(entity.cpf).toBe('456');
    expect(entity.name).toBe('Jane');
  });
});

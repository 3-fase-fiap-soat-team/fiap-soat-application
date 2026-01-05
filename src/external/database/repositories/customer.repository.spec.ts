import { Repository } from 'typeorm';
import { OrmCustomerRepository } from './customer.repository';
import { CustomerEntity } from '../entities/customer.entity';
import { Customer } from 'src/core/customers/entities/customer';

describe('OrmCustomerRepository', () => {
  let mockRepository: Partial<Repository<CustomerEntity>>;
  let ormCustomerRepository: OrmCustomerRepository;

  const now = new Date();
  const sampleEntity: CustomerEntity = {
    id: 'cust-1',
    name: 'Customer 1',
    email: 'a@b.com',
    cpf: '12345678900',
    createdAt: now,
    updatedAt: now,
  } as any;

  const sampleDomain = new Customer('cust-1', 'Customer 1', 'a@b.com', '12345678900', now, now);

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };

    ormCustomerRepository = new OrmCustomerRepository(
      mockRepository as unknown as Repository<CustomerEntity>,
    );
  });

  it('should save a customer and return domain object', async () => {
    (mockRepository.save as jest.Mock).mockResolvedValue(sampleEntity);

    const result = await ormCustomerRepository.save(sampleDomain);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Customer);
    expect(result.id).toBe(sampleDomain.id);
  });

  it('should find customer by id and return domain', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(sampleEntity);

    const result = await ormCustomerRepository.findById('cust-1');

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'cust-1' } });
    expect(result).toBeInstanceOf(Customer);
  });

  it('should return null when customer id not found', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(undefined);

    const result = await ormCustomerRepository.findById('not-found');

    expect(result).toBeNull();
  });

  it('should find customer by cpf', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(sampleEntity);

    const result = await ormCustomerRepository.findByCpf('12345678900');

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { cpf: '12345678900' } });
    expect(result).toBeInstanceOf(Customer);
  });

  it('should delete customer', async () => {
    (mockRepository.delete as jest.Mock).mockResolvedValue(undefined);

    await ormCustomerRepository.delete('cust-1');

    expect(mockRepository.delete).toHaveBeenCalledWith('cust-1');
  });

  it('should find all customers', async () => {
    (mockRepository.find as jest.Mock).mockResolvedValue([sampleEntity]);

    const result = await ormCustomerRepository.findAll();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(Customer);
  });
});

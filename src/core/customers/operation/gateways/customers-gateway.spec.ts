import { CustomersGateway } from './customers-gateway';
import { Customer } from '../../entities/customer';

describe('CustomersGateway', () => {
  const mockDataSource: any = {
    findAll: jest.fn(),
    findByCpf: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const gateway = new CustomersGateway(mockDataSource);
  const now = new Date();
  const customer = new Customer('c1', 'n', 'e@e.com', '123', now, now);

  it('should delegate data source calls', async () => {
    (mockDataSource.findAll as jest.Mock).mockResolvedValue([customer]);
    (mockDataSource.findByCpf as jest.Mock).mockResolvedValue(customer);
    (mockDataSource.findById as jest.Mock).mockResolvedValue(customer);
    (mockDataSource.save as jest.Mock).mockResolvedValue(customer);
    (mockDataSource.delete as jest.Mock).mockResolvedValue(undefined);

    await expect(gateway.findAll()).resolves.toEqual([customer]);
    await expect(gateway.findByCpf('123')).resolves.toBe(customer);
    await expect(gateway.findById('c1')).resolves.toBe(customer);
    await expect(gateway.save(customer)).resolves.toBe(customer);
    await expect(gateway.delete('c1')).resolves.toBeUndefined();
  });
});

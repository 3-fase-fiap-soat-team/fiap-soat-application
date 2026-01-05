import { OrderGateway } from './orders-gateway';
import { Order } from '../../entities/order';

describe('OrderGateway', () => {
  const mockDataSource: any = {
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByStatus: jest.fn(),
    refreshReadModel: jest.fn(),
  };

  const gateway = new OrderGateway(mockDataSource);

  const order = new Order('o1');

  it('should delegate save and find operations', async () => {
    (mockDataSource.save as jest.Mock).mockResolvedValue(order);
    (mockDataSource.findById as jest.Mock).mockResolvedValue(order);
    (mockDataSource.findAll as jest.Mock).mockResolvedValue([order]);
    (mockDataSource.findByStatus as jest.Mock).mockResolvedValue([order]);
    (mockDataSource.refreshReadModel as jest.Mock).mockResolvedValue(undefined);

    await expect(gateway.save(order)).resolves.toBe(order);
    await expect(gateway.findById('o1')).resolves.toBe(order);
    await expect(gateway.findAll()).resolves.toEqual([order]);
    await expect(gateway.findByStatus('pending')).resolves.toEqual([order]);
    await expect(gateway.refreshReadModel()).resolves.toBeUndefined();
  });
});

import { Repository, DataSource } from 'typeorm';
import { OrmOrderRepository } from './order.repository';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { Order } from 'src/core/orders/entities/order';
import { OrderStatus } from 'src/core/orders/entities/order-status';

describe('OrmOrderRepository', () => {
  let mockRepository: Partial<Repository<OrderEntity>> & { manager?: any };
  let mockDataSource: Partial<DataSource>;
  let ormOrderRepository: OrmOrderRepository;

  const now = new Date();

  const sampleItem: OrderItemEntity = {
    id: 'item-1',
    orderId: 'ord-1',
    productId: 'prod-1',
    productName: 'Product 1',
    productDescription: '',
    categoryName: 'Cat',
    unitPrice: 10.5 as any,
    quantity: 2,
    order: null as any,
    createdAt: now,
    updatedAt: now,
  } as any;

  const sampleEntity: OrderEntity = {
    id: 'ord-1',
    customerId: null,
    status: 'pending',
    transactionCode: null,
    paidAt: null,
    amountPaid: null,
    items: [sampleItem],
    createdAt: now,
    updatedAt: now,
  } as any;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    } as any;

    mockDataSource = {
      query: jest.fn(),
    } as any;

    ormOrderRepository = new OrmOrderRepository(
      mockRepository as unknown as Repository<OrderEntity>,
      mockDataSource as unknown as DataSource,
    );
  });

  it('should save order inside a transaction and return domain', async () => {
    (mockRepository.manager!.transaction as jest.Mock).mockImplementation(async (cb: any) => {
      return cb({ save: jest.fn().mockResolvedValue(sampleEntity) });
    });

    const dummyOrder = new Order('ord-1');
    // set a valid status so mapper can access order.status.value
    dummyOrder.status = new OrderStatus('pending');

    const result = await ormOrderRepository.save(dummyOrder);

    expect(mockRepository.manager!.transaction).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Order);
  });

  it('should refresh read model', async () => {
    (mockDataSource.query as jest.Mock).mockResolvedValue(undefined);

    await ormOrderRepository.refreshReadModel();

    expect(mockDataSource.query).toHaveBeenCalledWith('REFRESH MATERIALIZED VIEW CONCURRENTLY read_orders_summary');
  });

  it('should find order by id and return domain', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(sampleEntity);

    const result = await ormOrderRepository.findById('ord-1');

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'ord-1' }, relations: ['items'] });
    expect(result).toBeInstanceOf(Order);
  });

  it('should return null when order not found', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(undefined);

    const result = await ormOrderRepository.findById('not-found');

    expect(result).toBeNull();
  });

  it('should find all orders and map to domain', async () => {
    (mockRepository.find as jest.Mock).mockResolvedValue([sampleEntity]);

    const result = await ormOrderRepository.findAll();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(Order);
  });

  it('should find orders by status', async () => {
    (mockRepository.find as jest.Mock).mockResolvedValue([sampleEntity]);

    const result = await ormOrderRepository.findByStatus('pending');

    expect(mockRepository.find).toHaveBeenCalled();
    expect(result[0]).toBeInstanceOf(Order);
  });
});

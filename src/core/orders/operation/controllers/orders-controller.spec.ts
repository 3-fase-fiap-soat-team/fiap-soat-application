import { OrdersController } from './orders-controller';
import { CreateOrderUseCase } from '../../usecases/commands/create-order.usecase';
import { GetOrderByIdQuery } from '../../usecases/queries/get-order-by-id.query';
import { GetOrdersQuery } from '../../usecases/queries/get-orders.query';
import { GetKitchenOrdersQuery } from '../../usecases/queries/get-kitchen-orders.query';
import { GetOrderPaymentQRCodeQuery } from '../../usecases/queries/get-order-payment-qrcode.query';
import { UpdateOrderStatusUseCase } from '../../usecases/commands/update-order-status.usecase';

describe('OrdersController (core)', () => {
  const mockDataSource = {} as any;
  const fakeOrder: any = {
    id: 'o1',
    customerId: 'c1',
    status: { value: 'pending' },
    total: 10,
    items: [
      { id: 'i1', productId: 'p1', productName: 't', productDescription: 'd', unitPrice: 10, quantity: 1, totalPrice: 10, categoryName: 'food' }
    ],
    transactionCode: 'tx1',
    paidAt: null,
    amountPaid: null,
  };

  afterEach(() => jest.restoreAllMocks());

  it('create should call CreateOrderUseCase and return order id dto', async () => {
    jest.spyOn(CreateOrderUseCase, 'execute').mockResolvedValue(fakeOrder as any);

    const res = await OrdersController.create({ items: [{ productId: 'p1', quantity: 1 }] } as any, mockDataSource, {} as any, { create: () => fakeOrder } as any);
    expect(res).toHaveProperty('id', 'o1');
  });

  it('findById should return dto when found and throw when not', async () => {
    jest.spyOn(GetOrderByIdQuery, 'execute').mockResolvedValue(fakeOrder as any);
    const dto = await OrdersController.findById('o1', mockDataSource);
    expect(dto.id).toBe('o1');

    jest.spyOn(GetOrderByIdQuery, 'execute').mockResolvedValue(null as any);
    await expect(OrdersController.findById('no', mockDataSource)).rejects.toThrow('Order not found');
  });

  it('findAll and findKitchenOrders should return lists', async () => {
    jest.spyOn(GetOrdersQuery, 'execute').mockResolvedValue([fakeOrder] as any);
    const list = await OrdersController.findAll({ status: 'all' } as any, mockDataSource);
    expect(Array.isArray(list)).toBe(true);

    jest.spyOn(GetKitchenOrdersQuery, 'execute').mockResolvedValue([fakeOrder] as any);
    const kitchen = await OrdersController.findKitchenOrders(mockDataSource);
    expect(Array.isArray(kitchen)).toBe(true);
  });

  it('generatePaymentQRCode should call query and return value', async () => {
    jest.spyOn(GetOrderPaymentQRCodeQuery, 'execute').mockResolvedValue({ qr_data: 'q' } as any);
    const result = await OrdersController.generatePaymentQRCode('o1', mockDataSource, {} as any);
    expect(result).toEqual({ qr_data: 'q' });
  });

  it('updateStatus should call usecase and return dto', async () => {
    jest.spyOn(UpdateOrderStatusUseCase, 'execute').mockResolvedValue(fakeOrder as any);
    const res = await OrdersController.updateStatus({ orderId: 'o1', newStatus: 'ready' } as any, mockDataSource);
    expect(res).toHaveProperty('id', 'o1');
  });
});

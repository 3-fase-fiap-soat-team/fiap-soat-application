import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NestJSOrdersController } from './nestjs-orders.controller';
import { OrdersController } from 'src/core/orders/operation/controllers/orders-controller';

describe('NestJSOrdersController', () => {
  const mockOrderDataSource = {} as any;
  const mockProductDataSource = {} as any;
  const mockOrderFactory = {} as any;
  const mockMercado = {} as any;

  let controller: NestJSOrdersController;

  beforeEach(() => {
    controller = new NestJSOrdersController(
      mockOrderDataSource,
      mockProductDataSource,
      mockOrderFactory,
      mockMercado,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create order and return created id', async () => {
    jest.spyOn(OrdersController, 'create').mockResolvedValue({ id: 'o1' } as any);

    const result = await controller.create({ items: [{ productId: 'p1', quantity: 1 }] } as any);
    expect(result).toEqual({ id: 'o1' });
  });

  it('should throw BadRequestException when create fails', async () => {
    jest.spyOn(OrdersController, 'create').mockRejectedValue(new Error('invalid'));

    await expect(controller.create({ items: [] } as any)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should find order by id', async () => {
    jest.spyOn(OrdersController, 'findById').mockResolvedValue({ id: 'o1' } as any);

    const result = await controller.findById('o1');
    expect(result).toEqual({ id: 'o1' });
  });

  it('should throw NotFoundException when order not found', async () => {
    jest.spyOn(OrdersController, 'findById').mockRejectedValue(new Error('Order not found'));

    await expect(controller.findById('nope')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should map paymentStatus query param and call findAll', async () => {
    const spy = jest.spyOn(OrdersController, 'findAll').mockResolvedValue(['a'] as any);

    const resPending = await controller.findAll('pending');
    expect(resPending).toEqual(['a']);
    expect(spy).toHaveBeenCalledWith({ status: expect.anything() }, mockOrderDataSource);

    const resDefault = await controller.findAll(undefined);
    expect(resDefault).toEqual(['a']);
  });

  it('should generate payment qrcode and handle not found', async () => {
    jest.spyOn(OrdersController, 'generatePaymentQRCode').mockRejectedValue(new Error('Order not found'));
    await expect(controller.generatePaymentQRCode('x')).rejects.toBeInstanceOf(NotFoundException);

    jest.spyOn(OrdersController, 'generatePaymentQRCode').mockRejectedValue(new Error('Invalid status'));
    await expect(controller.generatePaymentQRCode('x')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should update status via prepare/finalize/deliver and handle not found', async () => {
    const updateSpy = jest.spyOn(OrdersController, 'updateStatus').mockResolvedValue({ ok: true } as any);

    const p = await controller.prepareOrder('o1');
    expect(p).toEqual({ ok: true });
    expect(updateSpy).toHaveBeenCalled();

    const f = await controller.finalizeOrder('o1');
    expect(f).toEqual({ ok: true });

    const d = await controller.deliverOrder('o1');
    expect(d).toEqual({ ok: true });

    jest.spyOn(OrdersController, 'updateStatus').mockRejectedValue(new Error('Order not found'));
    await expect(controller.prepareOrder('x')).rejects.toBeInstanceOf(NotFoundException);
  });
});

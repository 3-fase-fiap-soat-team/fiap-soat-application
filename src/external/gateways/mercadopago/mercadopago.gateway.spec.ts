import { MercadoPagoGateway } from './mercadopago.gateway';

describe('MercadoPagoGateway', () => {
  it('should call service.createQRCode and map response', async () => {
    const mockService: any = {
      createQRCode: jest.fn().mockResolvedValue({ qr_data: 'data', in_store_order_id: 'store-1' }),
      getPaymentInfo: jest.fn().mockResolvedValue({ id: 'pay-1' }),
    };

    const gateway = new MercadoPagoGateway(mockService);

    const request = {
      orderId: 'order-1',
      amount: 10,
      title: 't',
      description: 'd',
      items: [{ category: 'c', title: 't', description: 'd', quantity: 1, unitPrice: 10, totalAmount: 10 }],
    } as any;

    const resp = await gateway.generateQRCode(request);
    expect(mockService.createQRCode).toHaveBeenCalled();
    expect(resp.qr_data).toBe('data');

    const info = await gateway.getPaymentInfo('pay-1');
    expect(mockService.getPaymentInfo).toHaveBeenCalledWith('pay-1');
    expect(info.id).toBe('pay-1');
  });
});

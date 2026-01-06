import { MercadoPagoService } from './mercadopago.service';

describe('MercadoPagoService', () => {
  const service = new MercadoPagoService();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getPaymentInfo should return fallback when fetch fails', async () => {
    jest.spyOn(global, 'fetch' as any).mockRejectedValue(new Error('network'));

    const result = await service.getPaymentInfo('order_123');

    expect(result.id).toBe('order_123');
    expect(result.status).toBe('approved');
  });

  it('createQRCode should return parsed response when fetch ok', async () => {
    const fakeResp = { qr_data: 'qr', in_store_order_id: 'store-1' };
    jest.spyOn(global, 'fetch' as any).mockResolvedValue({ ok: true, json: async () => fakeResp } as any);

    const resp = await service.createQRCode({ orderId: 'o1', amount: 10, title: 't', description: 'd' } as any);

    expect(resp.qr_data).toBe('qr');
  });
});

import { MercadoPagoService } from './mercadopago-simple.service';

describe('MercadoPagoService (simple)', () => {
  const service = new MercadoPagoService();

  afterEach(() => jest.restoreAllMocks());

  it('createQRCode returns preference url when fetch ok', async () => {
    const fakePref = { sandbox_init_point: 'http://init' };
    jest.spyOn(global, 'fetch' as any).mockResolvedValue({ ok: true, json: async () => fakePref } as any);

    const res = await service.createQRCode({ orderId: 'o1', amount: 5, title: 't', description: 'd' } as any);
    expect(res.qr_data).toBe('http://init');
  });

  it('createQRCode returns fallback when fetch fails', async () => {
    jest.spyOn(global, 'fetch' as any).mockRejectedValue(new Error('fail'));

    const res = await service.createQRCode({ orderId: 'o2', amount: 5, title: 't', description: 'd' } as any);
    expect(res.qr_data).toContain('https://www.mercadopago.com.br/checkout');
  });

  it('getPaymentInfo returns fallback when fetch fails', async () => {
    jest.spyOn(global, 'fetch' as any).mockRejectedValue(new Error('fail'));

    const r = await service.getPaymentInfo('pay_1');
    expect(r.id).toBe('pay_1');
    expect(r.status).toBe('approved');
  });
});

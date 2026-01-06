import { NestJSWebhookController } from './nestjs-webhook.controller';
import { PaymentReceivedEventHandler } from '../../../core/orders/usecases/events/payment-received.handler';

describe('NestJSWebhookController', () => {
  const mockOrderDatasource: any = {};
  const mockMercadoGateway: any = { getPaymentInfo: jest.fn() };

  let controller: NestJSWebhookController;

  beforeEach(() => {
    controller = new NestJSWebhookController(mockOrderDatasource, mockMercadoGateway);
    jest.restoreAllMocks();
  });

  it('should return invalid_payload for bad payload', async () => {
    const res = await controller.handleMercadoPagoWebhook(null as any, {} as any);
    expect(res.status).toBe('invalid_payload');
  });

  it('should return ignored for non-payment payload', async () => {
    const res = await controller.handleMercadoPagoWebhook({ type: 'other' } as any, {} as any);
    expect(res.status).toBe('ignored');
  });

  it('should process approved payments and call handler', async () => {
    const payload = { type: 'payment', data: { id: 'pay_1' } } as any;
    const paymentData = { status: 'approved', id: 'pay_1', external_reference: 'ord-1', date_approved: new Date().toISOString(), transaction_amount: 10 } as any;

    mockMercadoGateway.getPaymentInfo.mockResolvedValue(paymentData);
    jest.spyOn(PaymentReceivedEventHandler, 'handle').mockResolvedValue(undefined as any);

    const res = await controller.handleMercadoPagoWebhook(payload, {} as any);
    expect(mockMercadoGateway.getPaymentInfo).toHaveBeenCalledWith('pay_1');
    expect(res.status).toBe('processed');
    expect(res.orderId).toBe('ord-1');
  });
});

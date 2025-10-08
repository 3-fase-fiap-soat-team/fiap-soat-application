import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentQRCodeRequest, PaymentQRCodeResponse } from '../../../interfaces/payment-gateway';
import { MercadoPagoService } from '../../providers/mercadopago.service';

@Injectable()
export class MercadoPagoGateway implements PaymentGateway {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  async generateQRCode(request: PaymentQRCodeRequest): Promise<PaymentQRCodeResponse> {
    // Adapter pattern: convertendo interface de domínio para interface do serviço externo
    const mercadoPagoRequest = {
      orderId: request.orderId,
      amount: request.amount,
      title: request.title,
      description: request.description,
      items: request.items?.map(item => ({
        category: item.category,
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalAmount: item.totalAmount,
      })),
    };

    const response = await this.mercadoPagoService.createQRCode(mercadoPagoRequest);
    
    return {
      qr_data: response.qr_data,
      in_store_order_id: response.in_store_order_id,
    };
  }

  async getPaymentInfo(paymentId: string): Promise<any> {
    return this.mercadoPagoService.getPaymentInfo(paymentId);
  }
}

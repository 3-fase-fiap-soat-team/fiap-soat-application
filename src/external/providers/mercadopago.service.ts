import { Injectable } from '@nestjs/common';
import { 
  QrCodePayload, 
  QrCodeItem,
  MercadoPagoPaymentData 
} from './interfaces/mercadopago.interface';

export interface MercadoPagoQRResponse {
  qr_data: string;
  in_store_order_id: string;
}

export interface CreateQRCodeRequest {
  orderId: string;
  amount: number;
  title: string;
  description: string;
  items?: QRCodeItem[];
}

export interface QRCodeItem {
  category: string;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

@Injectable()
export class MercadoPagoService {
  private readonly accessToken: string;
  private readonly baseUrl = 'https://api.mercadopago.com';
  private readonly userId = '2440640118';
  private readonly posId = '12345678';

  constructor() {
    // Usar credenciais reais do Mercado Pago como na main
    this.accessToken = 'APP_USR-7638198099120330-051416-274c5c4d7231992cc992c641091bf5a2-2440640118';
  }

  async createQRCode(request: CreateQRCodeRequest): Promise<MercadoPagoQRResponse> {
    try {
      console.log(`Gerando QR code para pedido ${request.orderId}`);

      // Usar URL de notificação da variável de ambiente ou fallback
      const notificationUrl = process.env.NOTIFICATION_URL || 'https://frank-raptor-vastly.ngrok-free.app/webhook/mercadopago';

      // Usar endpoint Point of Sale (POS) do Mercado Pago - mesma implementação da main
      const payload = {
        external_reference: request.orderId,
        notification_url: notificationUrl,
        total_amount: request.amount,
        items: request.items?.map((item) => ({
          category: item.category,
          title: item.title,
          description: item.description,
          quantity: item.quantity,
          unit_measure: 'unity',
          unit_price: item.unitPrice,
          total_amount: item.totalAmount,
        })) || [
          {
            category: 'food',
            title: request.title,
            description: request.description,
            quantity: 1,
            unit_measure: 'unity',
            unit_price: request.amount,
            total_amount: request.amount,
          }
        ],
        title: 'Pagamento de pedido',
        description: 'Pagamento de pedido',
      };

      console.log('Payload para Mercado Pago:', JSON.stringify(payload, null, 2));

      const response = await fetch(
        `${this.baseUrl}/instore/orders/qr/seller/collectors/${this.userId}/pos/${this.posId}/qrs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na API do Mercado Pago:', response.status, errorText);
        throw new Error(`Mercado Pago API error: ${response.status} - ${errorText}`);
      }

      const qrData = await response.json() as MercadoPagoQRResponse;
      console.log('QR Code gerado com sucesso:', qrData.in_store_order_id);
      
      return qrData;
    } catch (error) {
      console.error('Erro ao criar QR code no Mercado Pago:', error);
      throw new Error(`Falha na geração do QR code de pagamento: ${error.message}`);
    }
  }

  async getPaymentInfo(paymentId: string) {
    try {
      console.log(`Consultando pagamento ${paymentId} no Mercado Pago`);

      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment info: ${response.status}`);
      }

      const paymentData = await response.json();
      console.log('Dados do pagamento obtidos:', paymentData.status);
      
      return paymentData;
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error);
      
      // Mock para desenvolvimento quando a API falhar
      const orderId = paymentId.includes('_') ? paymentId.split('_')[0] : 'test-order-id';
      
      return {
        id: paymentId,
        status: 'approved',
        status_detail: 'accredited',
        external_reference: orderId,
        transaction_amount: 50.00,
        date_approved: new Date().toISOString(),
        payment_method_id: 'pix',
        payment_type_id: 'bank_transfer',
        transaction_details: {
          total_paid_amount: 50.00
        }
      };
    }
  }
}

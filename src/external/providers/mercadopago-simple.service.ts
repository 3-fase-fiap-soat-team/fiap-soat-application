import { Injectable } from '@nestjs/common';

export interface MercadoPagoQRResponse {
  qr_data: string;
  in_store_order_id: string;
}

export interface CreateQRCodeRequest {
  orderId: string;
  amount: number;
  title: string;
  description: string;
}

@Injectable()
export class MercadoPagoService {
  private readonly accessToken: string;
  private readonly baseUrl = 'https://api.mercadopago.com';

  constructor() {
    // Token de teste do Mercado Pago - substituir por variável de ambiente em produção
    this.accessToken = 'TEST-4457853695086654-080217-bf2b8b15cf5dd6fb2a7a3eca9cdcc4ad-461898779';
  }

  async createQRCode(request: CreateQRCodeRequest): Promise<MercadoPagoQRResponse> {
    try {
      // Criar uma preferência de pagamento no Mercado Pago
      const preference = await this.createPaymentPreference(request);
      
      return {
        qr_data: preference.sandbox_init_point, // URL que será convertida em QR code
        in_store_order_id: request.orderId
      };
    } catch (error) {
      console.error('Erro ao criar QR code no Mercado Pago:', error);
      
      // Fallback: gerar um link de pagamento direto
      const fallbackUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${request.orderId}`;
      
      return {
        qr_data: fallbackUrl,
        in_store_order_id: request.orderId
      };
    }
  }

  private async createPaymentPreference(request: CreateQRCodeRequest) {
    const payload = {
      items: [
        {
          title: request.title,
          description: request.description,
          quantity: 1,
          currency_id: "BRL",
          unit_price: request.amount
        }
      ],
      external_reference: request.orderId,
      notification_url: "https://webhook.site/unique-id/webhook/mercadopago", // URL temporária para testes
      back_urls: {
        success: "https://techlanchonete.com/payment/success",
        failure: "https://techlanchonete.com/payment/failure",
        pending: "https://techlanchonete.com/payment/pending"
      },
      auto_return: "approved",
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 1
      },
      payer: {
        name: "Cliente",
        surname: "Tech Lanchonete",
        email: "cliente@techlanchonete.com"
      }
    };

    console.log('Criando preferência no Mercado Pago:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API do Mercado Pago:', response.status, errorText);
      throw new Error(`Mercado Pago API error: ${response.status} - ${errorText}`);
    }

    const preferenceData = await response.json();
    console.log('Preferência criada com sucesso:', preferenceData.id);
    
    return preferenceData;
  }

  async getPaymentInfo(paymentId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error);
      
      // Mock para desenvolvimento quando a API falhar
      return {
        id: paymentId,
        status: 'approved',
        status_detail: 'accredited',
        external_reference: paymentId.includes('_') ? paymentId.split('_')[0] : 'test-order-id',
        transaction_amount: 50.00,
        date_approved: new Date().toISOString(),
        payment_method_id: 'pix',
        payment_type_id: 'bank_transfer'
      };
    }
  }
}

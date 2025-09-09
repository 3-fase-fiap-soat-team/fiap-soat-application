import { Controller, Post, Body, Query, HttpStatus, BadRequestException, Param } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentReceivedEventHandler, PaymentReceivedEventData } from '../../../core/orders/usecases/events/payment-received.handler';
import { IOrderDataSource } from '../../../interfaces/order-datasource';
import { OrderGateway } from '../../../core/orders/operation/gateways/orders-gateway';
import { MercadoPagoGateway } from '../../gateways/mercadopago/mercadopago.gateway';

@Controller('webhook')
@ApiTags('Webhook')
export class NestJSWebhookController {
  constructor(
    private readonly orderDataSource: IOrderDataSource,
    private readonly mercadoPagoGateway: MercadoPagoGateway,
  ) {}

  @Post('mercadopago')
  @ApiExcludeEndpoint() // Excluir da documentação pública - endpoint interno para webhooks
  @ApiOperation({ 
    summary: 'Webhook do Mercado Pago (Interno)',
    description: 'Endpoint interno para receber notificações de pagamento do Mercado Pago. Não deve ser usado publicamente.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Webhook processado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro no processamento do webhook',
  })
  async handleMercadoPagoWebhook(@Body() payload: any, @Query() query: any) {
    try {
      console.log('Webhook Mercado Pago recebido:', { payload, query });

      // Validação básica do payload do webhook
      if (!payload || typeof payload !== 'object') {
        console.log('Payload inválido recebido');
        return { status: 'invalid_payload' };
      }

      // Verificar se é um evento de pagamento
      if (payload.type !== 'payment' || !payload.data || !payload.data.id) {
        console.log('Evento ignorado - não é um pagamento válido');
        return { status: 'ignored' };
      }

      // Simular processamento de pagamento aprovado
      // Em uma implementação real, você consultaria a API do Mercado Pago
      // para verificar o status do pagamento usando payload.data.id
      
      // Processar pagamento através do gateway de pagamento (Clean Architecture)
      const paymentData = await this.mercadoPagoGateway.getPaymentInfo(payload.data.id);
      
      if (paymentData.status === 'approved') {
        const eventData: PaymentReceivedEventData = {
          transactionCode: paymentData.id,
          orderId: paymentData.external_reference, // ID do pedido vem do external_reference
          paidAt: new Date(paymentData.date_approved),
          amountPaid: paymentData.transaction_amount,
        };

        const orderGateway = new OrderGateway(this.orderDataSource);
        await PaymentReceivedEventHandler.handle(eventData, orderGateway);

        console.log(`Pagamento processado com sucesso para pedido ${paymentData.external_reference}`);
        return { status: 'processed', orderId: paymentData.external_reference };
      } else {
        console.log(`Pagamento rejeitado ou pendente: ${paymentData.status}`);
        return { status: 'ignored', reason: `Payment status: ${paymentData.status}` };
      }

    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw new BadRequestException(`Erro no processamento: ${error.message}`);
    }
  }
}

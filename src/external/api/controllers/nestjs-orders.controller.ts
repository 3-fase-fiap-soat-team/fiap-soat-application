import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { OrdersController } from 'src/core/orders/operation/controllers/orders-controller';
import { CreateOrderDTO } from 'src/core/orders/usecases/commands/create-order.usecase';
import { UpdateOrderStatusDTO } from 'src/core/orders/usecases/commands/update-order-status.usecase';
import { GetOrdersQueryParams } from 'src/core/orders/usecases/queries/get-orders.query';
import { OrderStatusFilter, ORDER_STATUS_DESCRIPTIONS } from 'src/core/orders/enums/order-status-filter.enum';
import { GetOrdersQueryDto } from '../dtos/get-orders-query.dto';
import { IOrderDataSource } from 'src/interfaces/order-datasource';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { OrderFactory } from 'src/core/orders/entities/factories/orders.factory';
import { MercadoPagoGateway } from '../../gateways/mercadopago/mercadopago.gateway';

@Controller('orders')
export class NestJSOrdersController {
  constructor(
    private readonly orderDataSource: IOrderDataSource,
    private readonly productDataSource: IProductDataSource,
    private readonly orderFactory: OrderFactory,
    private readonly mercadoPagoGateway: MercadoPagoGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pedido criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'cd8fce34-5045-43f2-96ff-ab36b717bbad',
          description: 'ID único do pedido criado'
        }
      }
    }
  })
  @ApiBody({
    description: 'Dados para criação do pedido. O customerId é opcional, pode receber apenas 1 produto ou combo com múltiplos produtos.',
    schema: {
      type: 'object',
      required: ['items'],
      properties: {
        customerId: { 
          type: 'string',
          example: '3f69217b-d5a0-4dd3-9005-719277ea325b',
          description: 'ID do cliente (opcional)'
        },
        items: {
          type: 'array',
          description: 'Lista de produtos do pedido',
          items: {
            type: 'object',
            required: ['productId', 'quantity'],
            properties: {
              productId: { 
                type: 'string',
                description: 'ID do produto',
                example: 'd79e7d79-c087-4597-8c02-304bbf83b407'
              },
              quantity: { 
                type: 'number',
                description: 'Quantidade do produto',
                example: 2,
                minimum: 1
              },
            },
          },
        },
      },
      example: {
        "customerId": "3f69217b-d5a0-4dd3-9005-719277ea325b",
        "items": [
          {
            "productId": "d79e7d79-c087-4597-8c02-304bbf83b407",
            "quantity": 2
          },
          {
            "productId": "5d93ee56-5cc8-4d86-b779-8eb6f29c186e",
            "quantity": 1
          },
          {
            "productId": "f79f4160-e6f0-4458-a287-bdf48b5b4b73",
            "quantity": 2
          }
        ]
      }
    },
  })
  async create(@Body() createOrderDto: CreateOrderDTO) {
    try {
      return await OrdersController.create(
        createOrderDto,
        this.orderDataSource,
        this.productDataSource,
        this.orderFactory,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('kitchen')
  @ApiOperation({ 
    summary: 'Lista pedidos para a cozinha',
    description: 'Retorna todos os pedidos em andamento ordenados por prioridade:\n' +
      '1. ready > 2. preparing > 3. received\n' +
      'Em cada status, os pedidos são ordenados do mais antigo para o mais novo.\n' +
      'Pedidos com status Finalizado ou Pendente não aparecem nesta lista.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pedidos para a cozinha',
  })
  async findKitchenOrders() {
    try {
      return await OrdersController.findKitchenOrders(this.orderDataSource);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async findById(@Param('id') id: string) {
    try {
      return await OrdersController.findById(id, this.orderDataSource);
    } catch (error) {
      if (error.message === 'Order not found') {
        throw new NotFoundException('Pedido não encontrado');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  @ApiQuery({
    name: 'paymentStatus',
    enum: ['pending', 'received', 'preparing', 'ready', 'finished'],
    required: false,
    description: 'Filtrar pedidos por status do pagamento',
    example: 'received',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pedidos retornada com sucesso',
  })
  async findAll(@Query('paymentStatus') paymentStatus?: string) {
    try {
      // Mapear paymentStatus para nosso OrderStatusFilter
      let status: OrderStatusFilter;
      switch (paymentStatus) {
        case 'pending':
          status = OrderStatusFilter.PENDING;
          break;
        case 'received':
          status = OrderStatusFilter.RECEIVED;
          break;
        case 'preparing':
          status = OrderStatusFilter.PREPARING;
          break;
        case 'ready':
          status = OrderStatusFilter.READY;
          break;
        case 'finished':
          status = OrderStatusFilter.FINISHED;
          break;
        default:
          status = OrderStatusFilter.ALL;
      }

      const params: GetOrdersQueryParams = { status };
      return await OrdersController.findAll(params, this.orderDataSource);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/payment-qrcode')
  @ApiOperation({ 
    summary: 'Gerar QR code de pagamento',
    description: 'Gera QR code para pagamento via Mercado Pago. **Regra de Negócio**: QR Code só pode ser gerado para pedidos com status "pending".'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Identificador único do pedido',
    type: 'string',
    example: 'cd8fce34-5045-43f2-96ff-ab36b717bbad'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'QR code gerado com sucesso',
    schema: {
      properties: {
        qr_data: {
          type: 'string',
          example: '00020101021243650016COM.MERCADOLIBRE020130636cd8fce34-5045-43f2-96ff-ab36b717bbad5204000053039865802BR5909Tech Loja6009SAO PAULO62070503***63045742',
          description: 'Dados do QR code para pagamento via Mercado Pago',
        },
        in_store_order_id: {
          type: 'string',
          example: 'cd8fce34-5045-43f2-96ff-ab36b717bbad',
          description: 'Identificador do pedido na loja',
        },
        amount: {
          type: 'number',
          example: 42.50,
          description: 'Valor total do pedido',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Pedido não pode gerar QR Code no status atual (deve estar "pending")',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async generatePaymentQRCode(@Param('id') id: string) {
    try {
      return await OrdersController.generatePaymentQRCode(id, this.orderDataSource, this.mercadoPagoGateway);
    } catch (error) {
      if (error.message === 'Order not found') {
        throw new NotFoundException('Pedido não encontrado');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/prepare')
  @ApiOperation({ 
    summary: 'Iniciar preparação do pedido',
    description: 'Inicia a preparação do pedido na cozinha. **Regra de Negócio**: Preparação só pode começar para pedidos com status "received" (pagamento confirmado).'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do pedido',
    type: 'string',
    example: 'd79e7d79-c087-4597-8c02-304bbf83b407'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido iniciado para preparação com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Pedido não pode iniciar preparação no status atual (deve estar "received")',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async prepareOrder(@Param('id') id: string) {
    try {
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: id,
        newStatus: 'preparing',
      };

      return await OrdersController.updateStatus(
        updateOrderStatusDto,
        this.orderDataSource,
      );
    } catch (error) {
      if (error.message === 'Order not found') {
        throw new NotFoundException('Pedido não encontrado');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/finalize')
  @ApiOperation({ 
    summary: 'Finalizar preparação do pedido',
    description: 'Marca o pedido como pronto para entrega. **Regra de Negócio**: Só podemos finalizar pedidos com status "preparing" (em preparação).'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do pedido',
    type: 'string',
    example: 'd79e7d79-c087-4597-8c02-304bbf83b407'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido finalizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Pedido não pode ser finalizado no status atual (deve estar "preparing")',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async finalizeOrder(@Param('id') id: string) {
    try {
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: id,
        newStatus: 'ready',
      };

      return await OrdersController.updateStatus(
        updateOrderStatusDto,
        this.orderDataSource,
      );
    } catch (error) {
      if (error.message === 'Order not found') {
        throw new NotFoundException('Pedido não encontrado');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/deliver')
  @ApiOperation({ 
    summary: 'Marcar pedido como entregue',
    description: 'Finaliza o ciclo do pedido marcando como entregue ao cliente. **Regra de Negócio**: Só podemos entregar pedidos com status "ready" (prontos para entrega).'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do pedido',
    type: 'string',
    example: 'd79e7d79-c087-4597-8c02-304bbf83b407'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido marcado como entregue com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Pedido não pode ser entregue no status atual (deve estar "ready")',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async deliverOrder(@Param('id') id: string) {
    try {
      const updateOrderStatusDto: UpdateOrderStatusDTO = {
        orderId: id,
        newStatus: 'finished',
      };

      return await OrdersController.updateStatus(
        updateOrderStatusDto,
        this.orderDataSource,
      );
    } catch (error) {
      if (error.message === 'Order not found') {
        throw new NotFoundException('Pedido não encontrado');
      }
      throw new BadRequestException(error.message);
    }
  }
}

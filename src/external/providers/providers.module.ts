import { Module } from '@nestjs/common';
import { IdGenerator } from 'src/interfaces/id-generator';
import { UUIDGenerator } from './uuid-generator/uuid-generator';
import { OrderFactory } from 'src/core/orders/entities/factories/orders.factory';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoGateway } from '../gateways/mercadopago/mercadopago.gateway';

@Module({
  providers: [
    {
      provide: IdGenerator,
      useClass: UUIDGenerator,
    },
    OrderFactory,
    MercadoPagoService,
    MercadoPagoGateway,
  ],
  exports: [IdGenerator, OrderFactory, MercadoPagoService, MercadoPagoGateway],
})
export class ProvidersModule {}

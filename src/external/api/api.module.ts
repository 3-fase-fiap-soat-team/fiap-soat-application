import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { NestJSCategoriesController } from './controllers/nestjs-categories.controller';
import { NestJSCustomerController } from './controllers/nestjs-customer.controller';
import { NestJSOrdersController } from './controllers/nestjs-orders.controller';
import { NestJSProductsController } from './controllers/nestjs-products.controller';
import { NestJSWebhookController } from './controllers/nestjs-webhook.controller';
import { DatabaseModule } from '../database/database.module';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [DatabaseModule, ProvidersModule],
  controllers: [
    HealthController,
    NestJSCategoriesController,
    NestJSCustomerController,
    NestJSOrdersController,
    NestJSProductsController,
    NestJSWebhookController,
  ],
})

export class ApiModule {}

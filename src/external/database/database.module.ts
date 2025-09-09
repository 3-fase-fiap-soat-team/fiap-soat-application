import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmCategoryRepository } from './repositories/category.repository';
import { OrmCustomerRepository } from './repositories/customer.repository';
import { OrmProductRepository } from './repositories/product.repository';
import { OrmOrderRepository } from './repositories/order.repository';
import { CategoryEntity } from './entities/category.entity';
import { CustomerEntity } from './entities/customer.entity';
import { ProductEntity } from './entities/product.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { ICategoryDataSource } from 'src/interfaces/category-datasource';
import { ICustomerDataSource } from 'src/interfaces/customer-datasource';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { IOrderDataSource } from 'src/interfaces/order-datasource';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'postgres',
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      CategoryEntity,
      CustomerEntity,
      ProductEntity,
      OrderEntity,
      OrderItemEntity,
    ]),
  ],
  providers: [
    {
      provide: ICategoryDataSource,
      useClass: OrmCategoryRepository,
    },
    {
      provide: ICustomerDataSource,
      useClass: OrmCustomerRepository,
    },
    {
      provide: IProductDataSource,
      useClass: OrmProductRepository,
    },
    {
      provide: IOrderDataSource,
      useClass: OrmOrderRepository,
    },
  ],
  exports: [
    ICategoryDataSource,
    ICustomerDataSource,
    IProductDataSource,
    IOrderDataSource,
  ],
})
export class DatabaseModule {}

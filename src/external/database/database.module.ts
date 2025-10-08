import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from 'src/config/database.config';
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
    TypeOrmModule.forRoot(getTypeOrmConfig()),
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

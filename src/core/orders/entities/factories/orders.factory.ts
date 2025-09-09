import { Injectable } from '@nestjs/common';
import { Order } from '../order';
import { OrderStatus } from 'src/core/orders/entities/order-status';
import { randomUUID } from 'crypto';
import { OrderItem } from '../order-item';
import { Product } from 'src/core/products/entities/product';

@Injectable()
export class OrderFactory {
  create(
    customerId: string | undefined,
    items: Array<{ product: Product; quantity: number; categoryName: string }>,
  ) {
    const id = randomUUID();
    const order = new Order(id);
    order.customerId = customerId ?? null;
    order.status = new OrderStatus('pending');
    
    const orderItems = items.map(
      (item) =>
        new OrderItem(
          randomUUID(),
          item.product.id,
          item.product.name,
          item.product.description,
          item.product.price,
          item.quantity,
          item.categoryName,
        ),
    );
    order.items = orderItems;
    return order;
  }
}

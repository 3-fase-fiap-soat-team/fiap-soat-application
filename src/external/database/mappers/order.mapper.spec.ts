import { OrderMapper } from './order.mapper';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { Order } from 'src/core/orders/entities/order';
import { OrderItem } from 'src/core/orders/entities/order-item';
import { OrderStatus } from 'src/core/orders/entities/order-status';

describe('OrderMapper', () => {
  it('toDomain should map entity to order domain', () => {
    const entity = new OrderEntity();
    entity.id = 'o1';
    entity.status = 'pending';
    entity.customerId = 'c1';
    const item = new OrderItemEntity();
    item.id = 'i1';
    item.productId = 'p1';
    item.productName = 'P';
    item.productDescription = 'D';
    item.unitPrice = 10;
    item.quantity = 2;
    item.categoryName = 'Cat';
    entity.items = [item];

    const order = OrderMapper.toDomain(entity as any);
    expect(order.id).toBe('o1');
    expect(order.items[0].productId).toBe('p1');
    expect(order.status.value).toBe('pending');
  });

  it('toPersistence maps order domain to entity', () => {
    const order = new Order('o2');
    order.status = new OrderStatus('pending');
    order.customerId = 'c1';
    order.items = [new OrderItem('i2', 'p2', 'P', 'D', 5, 1, 'Cat')];

    const entity = OrderMapper.toPersistence(order);
    expect(entity.id).toBe('o2');
    expect(entity.items[0].productId).toBe('p2');
  });
});

import { OrdersPresenter } from './orders-presenter';
import { Order } from '../../entities/order';
import { OrderItem } from '../../entities/order-item';
import { OrderStatus } from '../../entities/order-status';

describe('OrdersPresenter', () => {
  it('toDTO should map order and items', () => {
    const order = new Order('o1');
    order.status = new OrderStatus('pending');
    order.customerId = 'c1';
    order.items = [new OrderItem('i1', 'p1', 'P', 'D', 10, 2, 'Cat')];
    const dto = OrdersPresenter.toDTO(order);
    expect(dto.id).toBe('o1');
    expect(dto.items[0].productId).toBe('p1');
  });

  it('toDTOList should map arrays', () => {
    const order = new Order('o1');
    order.status = new OrderStatus('pending');
    order.items = [];
    const list = OrdersPresenter.toDTOList([order]);
    expect(Array.isArray(list)).toBe(true);
  });
});

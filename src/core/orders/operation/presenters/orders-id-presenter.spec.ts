import { OrderIdPresenter } from './orders-id-presenter';
import { Order } from '../../entities/order';

describe('OrderIdPresenter', () => {
  it('toDTO should return id object', () => {
    const order = new Order('o1');
    const dto = OrderIdPresenter.toDTO(order);
    expect(dto).toEqual({ id: 'o1' });
  });
});

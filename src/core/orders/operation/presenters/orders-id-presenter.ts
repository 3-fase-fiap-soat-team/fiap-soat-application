import { Order } from '../../entities/order';
import { OrderIdDTO } from 'src/core/common/dtos/order.dto';

export class OrderIdPresenter {
  static toDTO(order: Order): OrderIdDTO {
    return {
      id: order.id,
    };
  }
}

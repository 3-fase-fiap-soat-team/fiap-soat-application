import { Order } from '../../entities/order';
import { OrderDTO } from 'src/core/common/dtos/order.dto';

export class OrdersPresenter {
  static toDTO(order: Order): OrderDTO {
    return {
      id: order.id,
      customerId: order.customerId,
      status: order.status.value,
      total: order.total,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productDescription: item.productDescription,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        categoryName: item.categoryName,
      })),
      transactionCode: order.transactionCode,
      paidAt: order.paidAt,
      amountPaid: order.amountPaid,
    };
  }

  static toDTOList(orders: Order[]): OrderDTO[] {
    return orders.map(order => this.toDTO(order));
  }
}

import { Order } from '../../entities/order';
import { OrderGateway } from '../../operation/gateways/orders-gateway';
import { OrderFactory } from '../../entities/factories/orders.factory';
import { ProductGateway } from 'src/core/products/operation/gateways/product-gateway';

export interface CreateOrderDTO {
  customerId?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export class CreateOrderUseCase {
  static async execute(
    createOrderDto: CreateOrderDTO,
    orderGateway: OrderGateway,
    productGateway: ProductGateway,
    orderFactory: OrderFactory,
  ): Promise<Order> {
    
    // Validar produtos e buscar dados
    const productIds = createOrderDto.items.map(item => item.productId);
    const products = await productGateway.findManyByIds(productIds);
    
    if (products.length !== productIds.length) {
      throw new Error('One or more products not found');
    }

    // Preparar items para o factory
    const factoryItems = createOrderDto.items.map(itemDto => {
      const product = products.find(p => p.id === itemDto.productId);
      if (!product) {
        throw new Error(`Product ${itemDto.productId} not found`);
      }

      return {
        product,
        quantity: itemDto.quantity,
        categoryName: product.categoryId || 'Unknown', // Usando categoryId
      };
    });

    // Criar ordem usando factory
    const order = orderFactory.create(createOrderDto.customerId, factoryItems);

    // Salvar ordem
    return await orderGateway.save(order);
  }
}

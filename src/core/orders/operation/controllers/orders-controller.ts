import { IOrderDataSource } from "src/interfaces/order-datasource";
import { OrderGateway } from "../gateways/orders-gateway";
import { CreateOrderUseCase, CreateOrderDTO } from "../../usecases/commands/create-order.usecase";
import { UpdateOrderStatusUseCase, UpdateOrderStatusDTO } from "../../usecases/commands/update-order-status.usecase";
import { GetOrderByIdQuery } from "../../usecases/queries/get-order-by-id.query";
import { GetOrdersQuery, GetOrdersQueryParams } from "../../usecases/queries/get-orders.query";
import { GetKitchenOrdersQuery } from "../../usecases/queries/get-kitchen-orders.query";
import { GetOrderPaymentQRCodeQuery } from "../../usecases/queries/get-order-payment-qrcode.query";
import { OrdersPresenter } from "../presenters/orders-presenter";
import { OrderIdPresenter } from "../presenters/orders-id-presenter";
import { ProductGateway } from "src/core/products/operation/gateways/product-gateway";
import { IProductDataSource } from "src/interfaces/product-datasource";
import { OrderFactory } from "../../entities/factories/orders.factory";
import { PaymentGateway } from "src/interfaces/payment-gateway";

export class OrdersController {
    static async create(
        createOrderDto: CreateOrderDTO,
        orderDataSource: IOrderDataSource,
        productDataSource: IProductDataSource,
        orderFactory: OrderFactory,
    ) {
        const orderGateway = new OrderGateway(orderDataSource);
        const productGateway = new ProductGateway(productDataSource);
        
        const order = await CreateOrderUseCase.execute(
            createOrderDto,
            orderGateway,
            productGateway,
            orderFactory,
        );

        return OrderIdPresenter.toDTO(order);
    }

    static async findById(id: string, orderDataSource: IOrderDataSource) {
        const orderGateway = new OrderGateway(orderDataSource);
        const order = await GetOrderByIdQuery.execute(id, orderGateway);

        if (!order) {
            throw new Error('Order not found');
        }

        return OrdersPresenter.toDTO(order);
    }

    static async findAll(params: GetOrdersQueryParams, orderDataSource: IOrderDataSource) {
        const orderGateway = new OrderGateway(orderDataSource);
        const orders = await GetOrdersQuery.execute(params, orderGateway);
        return OrdersPresenter.toDTOList(orders);
    }

    static async findKitchenOrders(orderDataSource: IOrderDataSource) {
        const orderGateway = new OrderGateway(orderDataSource);
        const orders = await GetKitchenOrdersQuery.execute(orderGateway);
        return OrdersPresenter.toDTOList(orders);
    }

    static async generatePaymentQRCode(id: string, orderDataSource: IOrderDataSource, paymentGateway?: PaymentGateway) {
        const orderGateway = new OrderGateway(orderDataSource);
        return await GetOrderPaymentQRCodeQuery.execute(id, orderGateway, paymentGateway);
    }

    static async updateStatus(
        updateOrderStatusDto: UpdateOrderStatusDTO,
        orderDataSource: IOrderDataSource,
    ) {
        const orderGateway = new OrderGateway(orderDataSource);
        
        const order = await UpdateOrderStatusUseCase.execute(
            updateOrderStatusDto,
            orderGateway,
        );

        return OrdersPresenter.toDTO(order);
    }
}

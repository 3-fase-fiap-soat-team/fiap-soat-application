import { IOrderDataSource } from "src/interfaces/order-datasource";
import { Order } from "../../entities/order";

export class OrderGateway {
    dataSource: IOrderDataSource

    constructor(dataSource: IOrderDataSource){
        this.dataSource = dataSource
    }

    async save(order: Order): Promise<Order> {
        return await this.dataSource.save(order);
    }

    async findById(id: string): Promise<Order | null> {
        return await this.dataSource.findById(id)
    }

    async findAll(): Promise<Order[]> {
        return await this.dataSource.findAll();
    }

    async findByStatus(status: 'pending' | 'received' | 'preparing' | 'ready' | 'finished'): Promise<Order[]> {
        return await this.dataSource.findByStatus(status);
    }

    async refreshReadModel(): Promise<void> {
        return await this.dataSource.refreshReadModel();
    }
}

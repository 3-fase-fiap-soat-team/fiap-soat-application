import { Order } from "src/core/orders/entities/order";

export abstract class IOrderDataSource {
    abstract save(order: Order): Promise<Order>;
    abstract refreshReadModel(): Promise<void>;
    abstract findById(id: string): Promise<Order | null>;
    abstract findAll(): Promise<Order[]>;
    abstract findByStatus(status: 'pending' | 'received' | 'preparing' | 'ready' | 'finished'): Promise<Order[]>;
}
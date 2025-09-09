export class OrderStatus {
  constructor(
    readonly value: 'pending' | 'received' | 'preparing' | 'ready' | 'finished',
  ) {}

  equals(status: OrderStatus) {
    return this.value === status.value;
  }
}
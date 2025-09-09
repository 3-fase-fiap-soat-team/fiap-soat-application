import { OrderItem } from 'src/core/orders/entities/order-item';
import { OrderStatus } from 'src/core/orders/entities/order-status';

export class Order {
  public items = new Array<OrderItem>();
  public customerId: string | null;
  public status: OrderStatus;

  private _transactionCode: string | null = null;
  private _paidAt: Date | null = null;
  private _amountPaid: number | null = null;

  constructor(public readonly id: string) {}

  addOrderItem(item: OrderItem) {
    this.items.push(item);
  }

  get total() {
    return Number(this.items.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2));
  }

  markAsPaid(transactionCode: string, paidAt: Date, amountPaid: number) {
    this._transactionCode = transactionCode;
    this._paidAt = paidAt;
    this._amountPaid = amountPaid;
    this.status = new OrderStatus('received');
  }

  canPrepare(): boolean {
    return this.status.equals(new OrderStatus('received'));
  }

  prepare() {
    if (!this.canPrepare()) {
      throw new Error("O pedido só pode ser preparado se o status atual for 'recebido'");
    }
    this.status = new OrderStatus('preparing');
  }

  canFinalize(): boolean {
    return this.status.equals(new OrderStatus('preparing'));
  }

  finalize() {
    if (!this.canFinalize()) {
      throw new Error("O pedido só pode ser finalizado se o status atual for 'em preparação'");
    }
    this.status = new OrderStatus('ready');
  }

  canDeliver(): boolean {
    return this.status.equals(new OrderStatus('ready'));
  }

  deliver() {
    if (!this.canDeliver()) {
      throw new Error("O pedido só pode ser entregue se o status atual for 'pronto'");
    }
    this.status = new OrderStatus('finished');
  }

  get transactionCode(): string | null {
    return this._transactionCode;
  }

  get paidAt(): Date | null {
    return this._paidAt;
  }

  get amountPaid(): number | null {
    return this._amountPaid;
  }

  set transactionCode(value: string | null) {
    this._transactionCode = value;
  }

  set paidAt(value: Date | null) {
    this._paidAt = value;
  }

  set amountPaid(value: number | null) {
    this._amountPaid = value;
  }

  setPaymentDetails(transactionCode: string, paidAt: Date, amountPaid: number) {
    this._transactionCode = transactionCode;
    this._paidAt = paidAt;
    this._amountPaid = amountPaid;
  }
}
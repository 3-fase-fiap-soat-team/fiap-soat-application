export class PaymentReceivedEvent {
  constructor(
    public readonly transactionCode: string,
    public readonly orderId: string,
    public readonly paidAt: Date,
    public readonly amountPaid: number,
  ) {}
}

export interface OrderDTO {
  id: string;
  customerId: string | null;
  status: string;
  total: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productDescription: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    categoryName: string;
  }>;
  transactionCode?: string | null;
  paidAt?: Date | null;
  amountPaid?: number | null;
}

export interface OrderIdDTO {
  id: string;
}

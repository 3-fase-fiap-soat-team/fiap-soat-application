export interface PaymentQRCodeRequest {
  orderId: string;
  amount: number;
  title: string;
  description: string;
  items?: PaymentQRCodeItem[];
}

export interface PaymentQRCodeItem {
  category: string;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface PaymentQRCodeResponse {
  qr_data: string;
  in_store_order_id: string;
}

export interface PaymentGateway {
  generateQRCode(request: PaymentQRCodeRequest): Promise<PaymentQRCodeResponse>;
  getPaymentInfo(paymentId: string): Promise<any>;
}

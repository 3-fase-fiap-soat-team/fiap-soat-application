export interface QrCodePayload {
  external_reference: string;
  notification_url: string;
  total_amount: number;
  items: QrCodeItem[];
  title: string;
  description: string;
}

export interface QrCodeItem {
  category: string;
  title: string;
  description: string;
  quantity: number;
  unit_measure: string;
  unit_price: number;
  total_amount: number;
}

export interface MercadoPagoWebhookPayload {
  id?: number;
  live_mode?: boolean;
  type?: string;
  date_created?: string;
  application_id?: number;
  user_id?: number;
  version?: number;
  api_version?: string;
  action?: string;
  data?: {
    id?: string;
  };
}

export interface MercadoPagoPaymentData {
  id: number;
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  status_detail: string;
  external_reference: string;
  transaction_amount: number;
  date_approved?: string;
  payment_method_id: string;
  payment_type_id: string;
  transaction_details?: {
    total_paid_amount: number;
  };
}

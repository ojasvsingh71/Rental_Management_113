export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  image: string;
  qrCode?: string;
  isAvailable: boolean;
  specifications: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface BookingPeriod {
  start: Date;
  end: Date;
  productId: string;
}

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  products: OrderProduct[];
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  deliveryAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderProduct {
  productId: string;
  product: Product;
  quantity: number;
  dailyRate: number;
  totalDays: number;
  subtotal: number;
}

export interface DeliveryTask {
  id: string;
  orderId: string;
  type: 'pickup' | 'delivery' | 'return';
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed';
  scheduledDate: Date;
  address: string;
  assignedTo?: string;
  notes?: string;
  photos?: string[];
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  estimatedTime?: string;
  actualTime?: string;
  signature?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'damaged';
}

export interface Notification {
  id: string;
  type: 'reminder' | 'overdue' | 'payment' | 'delivery' | 'system';
  title: string;
  message: string;
  recipientType: 'customer' | 'staff' | 'admin';
  recipientId: string;
  orderId?: string;
  productId?: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: Date;
  sentAt?: Date;
  channels: ('email' | 'sms' | 'push' | 'portal')[];
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'paypal' | 'razorpay' | 'bank_transfer';
  isActive: boolean;
  config: Record<string, any>;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'full' | 'balance' | 'penalty';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: string;
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  dueDate?: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface NotificationSettings {
  id: string;
  type: 'return_reminder' | 'overdue_alert' | 'payment_due' | 'delivery_update';
  enabled: boolean;
  leadTimeDays: number;
  channels: ('email' | 'sms' | 'push' | 'portal')[];
  template: string;
  recipientType: 'customer' | 'staff' | 'both';
}

export interface PenaltyRule {
  id: string;
  name: string;
  type: 'late_return' | 'damage' | 'loss';
  calculation: 'fixed' | 'percentage' | 'daily';
  amount: number;
  gracePeriodHours: number;
  maxAmount?: number;
  isActive: boolean;
}

export interface Analytics {
  revenue: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    overdue: number;
  };
  products: {
    mostRented: { productId: string; count: number }[];
    leastRented: { productId: string; count: number }[];
    utilization: { productId: string; percentage: number }[];
  };
  customers: {
    new: number;
    returning: number;
    topSpenders: { customerId: string; amount: number }[];
  };
}
export interface DashboardStats {
  totalOrders: number;
  activeRentals: number;
  totalRevenue: number;
  availableProducts: number;
  pendingDeliveries: number;
  monthlyGrowth: number;
  overdueReturns: number;
  pendingPayments: number;
  unreadNotifications: number;
}
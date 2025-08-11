import { create } from 'zustand';
import { Product, Order, Customer, DeliveryTask, DashboardStats, Notification, Payment, Analytics } from '../types';

interface Store {
  // Products
  products: Product[];
  selectedProduct: Product | null;
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;

  // Customers
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;

  // Delivery
  deliveryTasks: DeliveryTask[];
  setDeliveryTasks: (tasks: DeliveryTask[]) => void;
  updateDeliveryTask: (id: string, task: Partial<DeliveryTask>) => void;

  // Dashboard
  stats: DashboardStats | null;
  setStats: (stats: DashboardStats) => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Payments
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;

  // Analytics
  analytics: Analytics | null;
  setAnalytics: (analytics: Analytics) => void;

  // UI State
  currentView: string;
  setCurrentView: (view: string) => void;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Professional Camera Kit',
    description: 'Complete DSLR camera setup with lenses and accessories',
    category: 'Photography',
    dailyRate: 45,
    weeklyRate: 250,
    monthlyRate: 900,
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    isAvailable: true,
    specifications: {
      'Sensor': '24.2MP APS-C',
      'Lens': '18-55mm f/3.5-5.6',
      'ISO Range': '100-25600',
      'Video': '4K UHD'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'DJ Controller Pro',
    description: '4-channel professional DJ controller with built-in mixer',
    category: 'Audio',
    dailyRate: 75,
    weeklyRate: 450,
    monthlyRate: 1600,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    isAvailable: true,
    specifications: {
      'Channels': '4-channel',
      'Connectivity': 'USB, MIDI',
      'Jog Wheels': 'Touch-sensitive',
      'Software': 'Serato DJ included'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Professional Lighting Kit',
    description: 'Complete studio lighting setup with stands and modifiers',
    category: 'Lighting',
    dailyRate: 35,
    weeklyRate: 200,
    monthlyRate: 720,
    image: 'https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?auto=compress&cs=tinysrgb&w=800',
    isAvailable: false,
    specifications: {
      'Lights': '3x LED panels',
      'Power': '50W each',
      'Color Temperature': '3200K-5600K',
      'Stands': '3x adjustable stands'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockStats: DashboardStats = {
  totalOrders: 156,
  activeRentals: 23,
  totalRevenue: 24750,
  availableProducts: 42,
  pendingDeliveries: 8,
  monthlyGrowth: 12.5,
  overdueReturns: 5,
  pendingPayments: 8,
  unreadNotifications: 12,
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Return Reminder',
    message: 'Camera Kit rental for Sarah Johnson is due for return in 2 days',
    recipientType: 'staff',
    recipientId: 'staff-1',
    orderId: '1',
    productId: '1',
    isRead: false,
    priority: 'medium',
    scheduledFor: new Date('2024-03-18'),
    channels: ['email', 'portal'],
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    type: 'overdue',
    title: 'Overdue Alert',
    message: 'DJ Controller rental is 1 day overdue - contact customer immediately',
    recipientType: 'staff',
    recipientId: 'staff-1',
    orderId: '2',
    productId: '2',
    isRead: false,
    priority: 'urgent',
    sentAt: new Date('2024-03-15T10:00:00'),
    channels: ['email', 'sms'],
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Due',
    message: 'Balance payment of $225 is due tomorrow for Order #2',
    recipientType: 'customer',
    recipientId: 'customer-2',
    orderId: '2',
    isRead: true,
    priority: 'high',
    scheduledFor: new Date('2024-03-20'),
    channels: ['email', 'portal'],
    createdAt: new Date('2024-03-15'),
  },
];
export const useStore = create<Store>((set, get) => ({
  // Products
  products: mockProducts,
  selectedProduct: null,
  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, productUpdate) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...productUpdate } : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  // Orders
  orders: [],
  selectedOrder: null,
  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, orderUpdate) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...orderUpdate } : o)),
    })),

  // Customers
  customers: [],
  setCustomers: (customers) => set({ customers }),
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),

  // Delivery
  deliveryTasks: [],
  setDeliveryTasks: (tasks) => set({ deliveryTasks: tasks }),
  updateDeliveryTask: (id, taskUpdate) =>
    set((state) => ({
      deliveryTasks: state.deliveryTasks.map((t) => (t.id === id ? { ...t, ...taskUpdate } : t)),
    })),

  // Dashboard
  stats: mockStats,
  setStats: (stats) => set({ stats }),

  // Notifications
  notifications: mockNotifications,
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({ 
    notifications: [notification, ...state.notifications] 
  })),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    )
  })),
  clearAllNotifications: () => set({ notifications: [] }),

  // Payments
  payments: [],
  setPayments: (payments) => set({ payments }),
  addPayment: (payment) => set((state) => ({ payments: [...state.payments, payment] })),
  updatePayment: (id, paymentUpdate) =>
    set((state) => ({
      payments: state.payments.map((p) => (p.id === id ? { ...p, ...paymentUpdate } : p)),
    })),

  // Analytics
  analytics: null,
  setAnalytics: (analytics) => set({ analytics }),

  // UI State
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
}));
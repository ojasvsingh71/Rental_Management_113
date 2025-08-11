export interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  bg: string;
  trend: 'up' | 'down';
}

export interface Rental {
  id: string;
  orderReference?: string;
  customerId: string;
  productId: string;
  startDate: string;
  endDate: string;
  status: 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
  };
}

export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: {
    hour: number;
    day: number;
    week: number;
    month: number;
  };
  stock: number;
  available: number;
  rented: number;
  ecoScore: number;
  rating: number;
  totalRentals: number;
  revenue: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  lastMaintenance: string;
}

export interface Delivery {
  id: string;
  type: 'Pickup' | 'Return' | 'Delivery';
  customer: string;
  product: string;
  address: string;
  time: string;
  date: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  driver: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: any;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}
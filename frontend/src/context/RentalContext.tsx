import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  availability: 'available' | 'rented' | 'maintenance';
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    rate: number;
    duration: number;
    durationType: 'hour' | 'day' | 'week' | 'month';
  }>;
  status: 'quotation' | 'confirmed' | 'pickup' | 'delivered' | 'returned';
  startDate: string;
  endDate: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  pickupScheduled?: string;
  returnScheduled?: string;
  lateFee?: number;
}

interface RentalContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  getAvailableProducts: (startDate: string, endDate: string) => Product[];
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Professional Camera Kit',
    category: 'Photography',
    description: 'High-end DSLR camera with professional lenses',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
    hourlyRate: 25,
    dailyRate: 150,
    weeklyRate: 900,
    monthlyRate: 3000,
    availability: 'available',
    quantity: 5
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    category: 'Electronics',
    description: 'Latest MacBook Pro with M3 chip for professional work',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    hourlyRate: 15,
    dailyRate: 80,
    weeklyRate: 480,
    monthlyRate: 1600,
    availability: 'available',
    quantity: 8
  },
  {
    id: '3',
    name: 'Electric Drill Set',
    category: 'Tools',
    description: 'Complete electric drill set with various bits',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
    hourlyRate: 8,
    dailyRate: 35,
    weeklyRate: 200,
    monthlyRate: 650,
    availability: 'rented',
    quantity: 3
  },
  {
    id: '4',
    name: 'Party Tent 20x30',
    category: 'Events',
    description: 'Large party tent for outdoor events',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
    hourlyRate: 50,
    dailyRate: 200,
    weeklyRate: 1200,
    monthlyRate: 4000,
    availability: 'available',
    quantity: 2
  },
  {
    id: '5',
    name: 'Gaming Chair Pro',
    category: 'Furniture',
    description: 'Ergonomic gaming chair with RGB lighting',
    image: 'https://images.pexels.com/photos/4009600/pexels-photo-4009600.jpeg',
    hourlyRate: 5,
    dailyRate: 25,
    weeklyRate: 150,
    monthlyRate: 500,
    availability: 'available',
    quantity: 12
  }
];

const initialOrders: Order[] = [
  {
    id: '1001',
    customerId: 'c1',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    products: [
      {
        productId: '1',
        productName: 'Professional Camera Kit',
        quantity: 1,
        rate: 150,
        duration: 3,
        durationType: 'day'
      }
    ],
    status: 'confirmed',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    totalAmount: 450,
    paidAmount: 450,
    createdAt: '2024-01-12T10:00:00Z',
    pickupScheduled: '2024-01-15T09:00:00Z'
  },
  {
    id: '1002',
    customerId: 'c2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    products: [
      {
        productId: '2',
        productName: 'MacBook Pro 16"',
        quantity: 2,
        rate: 80,
        duration: 7,
        durationType: 'day'
      }
    ],
    status: 'delivered',
    startDate: '2024-01-10',
    endDate: '2024-01-17',
    totalAmount: 1120,
    paidAmount: 560,
    createdAt: '2024-01-08T14:30:00Z',
    returnScheduled: '2024-01-17T16:00:00Z'
  }
];

export function RentalProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productUpdate } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: (1000 + orders.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrder = (id: string, orderUpdate: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...orderUpdate } : o));
  };

  const getAvailableProducts = (startDate: string, endDate: string) => {
    return products.filter(product => product.availability === 'available');
  };

  return (
    <RentalContext.Provider value={{
      products,
      orders,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrder,
      getAvailableProducts
    }}>
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
}
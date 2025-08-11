import React, { useState } from 'react';
import { Navigation } from './components/Layout/Navigation';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProductList } from './components/Products/ProductList';
import { AvailabilityCalendar } from './components/Calendar/AvailabilityCalendar';
import { OrderList } from './components/Orders/OrderList';
import { DeliveryDashboard } from './components/Delivery/DeliveryDashboard';
import { PaymentDashboard } from './components/Payments/PaymentDashboard';
import { NotificationSettings } from './components/Settings/NotificationSettings';
import { useStore } from './hooks/useStore';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentView } = useStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductList />;
      case 'calendar':
        return <AvailabilityCalendar />;
      case 'orders':
        return <OrderList />;
      case 'delivery':
        return <DeliveryDashboard />;
      case 'payments':
        return <PaymentDashboard />;
      case 'settings':
        return <NotificationSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-6">
          {renderCurrentView()}
        </main>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProductManagement } from './components/ProductManagement';
import { OrderManagement } from './components/OrderManagement';
import { CustomerPortal } from './components/CustomerPortal';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { NotificationSystem } from './components/NotificationSystem';
import { AdvancedPricing } from './components/AdvancedPricing';
import { PaymentSetupGuide } from './components/PaymentIntegration';
import { RentalProvider } from './context/RentalContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'customer'>('admin');

  const renderContent = () => {
    if (userRole === 'customer') {
      return <CustomerPortal />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'reports':
        return <Reports />;
      case 'pricing':
        return <AdvancedPricing />;
      case 'payments':
        return <PaymentSetupGuide />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <RentalProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          userRole={userRole}
          setUserRole={setUserRole}
        />
        <main className="pt-16">
          {renderContent()}
        </main>
        
        {/* Notification System (only for admin) */}
        {userRole === 'admin' && (
          <div className="fixed top-4 right-4 z-40">
            <NotificationSystem />
          </div>
        )}
      </div>
    </RentalProvider>
  );
}

export default App;
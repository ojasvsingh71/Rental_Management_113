import React, { useState } from "react";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Delivery from "./pages/Delivery";
import Sustainability from "./pages/Sustainability";
import ComingSoon from "./pages/ComingSoon";
import DamageChecker from "./pages/Damage-detector";
import { sidebarItems } from "./data/mockData";
import { useAuth } from "./contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const getPageTitle = () => {
    return (
      sidebarItems.find((item) => item.id === activeTab)?.label || "Dashboard"
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "delivery":
        return <Delivery />;
      case "sustainability":
        return <Sustainability />;
      case "scans":
        return <DamageChecker />;
      default:
        return <ComingSoon title={getPageTitle()} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          onLogout={logout}
          sidebarItems={sidebarItems}
        />
      </div>

      <div className="flex-1 overflow-auto lg:ml-0">
        {/* Mobile menu button */}
        <div className="lg:hidden bg-white border-b p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <Header title={getPageTitle()} />
        <main className="p-4 md:p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
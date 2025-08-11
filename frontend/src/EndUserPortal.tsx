import React, { useState } from 'react';
import { 
  Calendar, FileText, Camera, Leaf, Bell, User, 
  LogOut, Award, Phone, HelpCircle
} from 'lucide-react';
import ComingSoon from './pages/ComingSoon';
import { currentRental } from './data/enduserData';
import { SidebarItem } from './types';

interface EndUserPortalProps {
  onLogout: () => void;
}

const EndUserPortal: React.FC<EndUserPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { id: 'schedule', label: 'Schedule & Timeline', icon: Calendar },
    { id: 'usage', label: 'Usage Guidelines', icon: FileText },
    { id: 'condition', label: 'Condition Reporting', icon: Camera },
    { id: 'ecotips', label: 'Eco Tips & Impact', icon: Leaf },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const getPageTitle = () => {
    return sidebarItems.find(item => item.id === activeTab)?.label || 'Schedule & Timeline';
  };

  const renderContent = () => {
    return <ComingSoon title={getPageTitle()} />;
  };

  const CustomSidebar = () => (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">EcoRent</h2>
            <p className="text-sm text-gray-500">End User Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 flex-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const unreadCount = item.id === 'notifications' ? 2 : 0;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              {item.label}
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t mt-auto">
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Eco User</span>
          </div>
          <div className="text-sm text-green-700">CO₂ Saved: 2.3 kg</div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );

  const CustomHeader = () => (
    <header className="bg-white shadow-sm border-b p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-green-700 text-sm font-medium">Active Rental</span>
          </div>
          <button className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            Emergency
          </button>
        </div>
      </div>
    </header>
  );

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
        <CustomSidebar />
      </div>
        <CustomHeader />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

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
        
export default EndUserPortal;
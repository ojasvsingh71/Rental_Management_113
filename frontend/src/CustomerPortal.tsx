import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  Calendar,
  CreditCard,
  Camera,
  Bell,
  User,
  Leaf,
  Heart,
  LogOut,
  Award,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";
import Browse from "./pages/customer/Browse";
import Rentals from "./pages/customer/Rentals";
import CalendarPage from "./pages/customer/Calendar";
import Contracts from "./pages/customer/Contracts";
import Payments from "./pages/customer/Payments";
import ComingSoon from "./pages/ComingSoon";
import DamageChecker from "./pages/Damage-detector";
import { sustainabilityData } from "./data/customerData";
import { SidebarItem } from "./types";
import { useAuth } from "./contexts/AuthContext";
import Wishlist from "./pages/customer/Wishlist";
import Sustainability from "./pages/Sustainability";

// **New imports for notifications and profile**
import Notifications from "./pages/customer/Notifications";
import Profile from "./pages/customer/Profile";

interface WishlistItem {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  price?: string;
}

interface CustomerPortalProps {
  onLogout: () => void;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ onLogout }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("browse");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cart state (items added from wishlist)
  const [cartItems, setCartItems] = useState<WishlistItem[]>([]);

  // Add item to cart from wishlist
  const handleAddToCart = (item: WishlistItem) => {
    setCartItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev; // prevent duplicates
      return [...prev, item];
    });
    setActiveTab("contracts"); // Switch to Contracts tab
  };

  const sidebarItems: SidebarItem[] = [
    { id: "browse", label: "Browse Products", icon: Search },
    { id: "rentals", label: "My Rentals", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "contracts", label: "Orders & Contracts", icon: CreditCard },
    { id: "payments", label: "Payments & Billing", icon: CreditCard },
    { id: "scans", label: "Condition Reports", icon: Camera },
    { id: "sustainability", label: "My Impact", icon: Leaf },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile & Settings", icon: User },
  ];

  const getPageTitle = () => {
    return (
      sidebarItems.find((item) => item.id === activeTab)?.label ||
      "Browse Products"
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "browse":
        return <Browse />;
      case "rentals":
        return <Rentals />;
      case "wishlist":
        return <Wishlist onAddToCart={handleAddToCart} />;
      case "calendar":
        return <CalendarPage />;
      case "contracts":
        return <Contracts cartItems={cartItems} />;
      case "payments":
        return <Payments />;
      case "scans":
        return <DamageChecker />;
      case "sustainability":
        return <Sustainability />;
      case "notifications":
        return <Notifications />;
      case "profile":
        return <Profile />;
      default:
        return <ComingSoon title={getPageTitle()} />;
    }
  };

  const CustomSidebar = () => (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">EcoRent</h2>
            <p className="text-sm text-gray-500">Customer Portal</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const unreadCount = item.id === "notifications" ? 3 : 0;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
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
            <span className="font-medium text-green-900">
              {sustainabilityData.ecoLevel}
            </span>
          </div>
          <div className="text-sm text-green-700">
            CO₂ Saved: {sustainabilityData.totalCO2Saved} kg
          </div>
        </div>
        <button
          onClick={logout}
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {getPageTitle()}
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-green-700 text-sm font-medium">
              Total CO₂ Saved: {sustainabilityData.totalCO2Saved} kg
            </span>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-700 text-sm font-medium">
              Savings: ${sustainabilityData.totalSavings}
            </span>
          </div>
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
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <CustomSidebar />
      </div>

      <div className="flex-1 overflow-auto lg:ml-0">
        {/* Mobile menu button */}
        <div className="lg:hidden bg-white border-b p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <CustomHeader />
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default CustomerPortal;

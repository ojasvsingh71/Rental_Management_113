import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  title: string;
  showQuickAction?: boolean;
  onQuickAction?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showQuickAction = true, onQuickAction }) => {
  return (
    <header className="bg-white shadow-sm border-b p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-green-700 text-sm font-medium">Live Updates</span>
          </div>
          {showQuickAction && (
            <button 
              onClick={onQuickAction}
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Quick Action
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
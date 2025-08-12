import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  title: string;
  showQuickAction?: boolean;
  onQuickAction?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showQuickAction = true }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const quickActions = [
    { id: 1, label: 'Add Task', action: () => alert('Add Task clicked') },
    { id: 2, label: 'Send Message', action: () => alert('Send Message clicked') },
    { id: 3, label: 'Create Event', action: () => alert('Create Event clicked') },
  ];

  return (
    <header className="bg-white shadow-sm border-b p-4 md:p-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-green-700 text-sm font-medium">Live Updates</span>
          </div>
          {showQuickAction && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Quick Action
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.action();
                        setOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-green-50 text-green-700"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

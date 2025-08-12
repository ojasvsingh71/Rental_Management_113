import React from 'react';
import { Package } from 'lucide-react';

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-green-100 via-white to-green-50 rounded-2xl shadow-lg border border-green-200 p-10 text-center transform hover:scale-105 transition-transform duration-300">
      <div className="flex justify-center mb-6">
        <Package className="h-20 w-20 text-green-400 animate-pulse" />
      </div>
      <h3 className="text-3xl font-extrabold text-green-900 mb-3 tracking-wide">
        {title} <span className="text-green-600">Coming Soon</span>
      </h3>
      <p className="text-green-800 mb-6 leading-relaxed">
        We're working hard to bring this feature to you. Stay tuned and be the first to try it out!
      </p>
      <button className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition">
        Request Early Access
      </button>
    </div>
  );
};

export default ComingSoon;

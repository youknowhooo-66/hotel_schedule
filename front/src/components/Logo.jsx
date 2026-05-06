import React from 'react';
import { HotelIcon } from './CustomIcons';
import { Link } from 'react-router-dom';

export default function Logo({ className, iconClassName, textClassName, showText = true, to = "/dashboard" }) {
  return (
    <Link to={to} className={`flex items-center gap-2 group ${className}`}>
      <div className={`w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:rotate-12 transition-transform duration-300 ${iconClassName}`}>
        <HotelIcon className="w-5 h-5 text-white" />
      </div>
      {showText && (
        <span className={`text-primary-900 font-extrabold text-xl tracking-tight ${textClassName}`}>
          HotelPro
        </span>
      )}
    </Link>
  );
}

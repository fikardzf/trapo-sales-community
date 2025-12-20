// components/ui/Input.tsx
import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = ({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) => {
  const inputClasses = `
    w-full p-2 sm:p-2 md:p-3 text-sm text-gray-900 
    border border-gray-200 rounded-md 
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    ${error ? 'border-red-500' : ''}
    ${icon ? 'pl-10' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
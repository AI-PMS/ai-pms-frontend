'use client';

import React from 'react';

// Proper TypeScript interfaces for mobile-optimized components
interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  className?: string;
}

interface MobileOptimizedTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  className?: string;
}

interface MobileOptimizedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  className?: string;
}

// Mobile-Optimized Input Components
export const MobileOptimizedInput = ({ 
  className = '', 
  error = false,
  ...props 
}: MobileOptimizedInputProps) => {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 border rounded-lg transition-colors mobile-optimized-input ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{
        fontSize: '16px !important',
        minHeight: '44px',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
      }}
    />
  );
};

export const MobileOptimizedTextArea = ({ 
  className = '', 
  error = false,
  ...props 
}: MobileOptimizedTextAreaProps) => {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 border rounded-lg transition-colors mobile-optimized-textarea ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{
        fontSize: '16px !important',
        minHeight: '44px',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
      }}
    />
  );
};

export const MobileOptimizedSelect = ({ 
  className = '', 
  error = false,
  ...props 
}: MobileOptimizedSelectProps) => {
  return (
    <select
      {...props}
      className={`w-full px-4 py-3 border rounded-lg transition-colors mobile-optimized-select ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{
        fontSize: '16px !important',
        minHeight: '44px',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
      }}
    />
  );
};
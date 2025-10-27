'use client';

import React, { useRef, useEffect } from 'react';

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

// Mobile-Optimized Input Components with FIXED rendering
export const MobileOptimizedInput = ({ 
  className = '', 
  error = false,
  value,
  onChange,
  ...props 
}: MobileOptimizedInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Force re-render fix for mobile browsers
  useEffect(() => {
    if (inputRef.current && value !== undefined) {
      // This ensures the DOM value matches the React state
      if (inputRef.current.value !== value) {
        inputRef.current.value = String(value);
      }
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      {...props}
      value={value}
      onChange={onChange}
      className={`mobile-optimized-input w-full px-4 py-3 border rounded-lg transition-colors ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    />
  );
};

export const MobileOptimizedTextArea = ({ 
  className = '', 
  error = false,
  value,
  onChange,
  ...props 
}: MobileOptimizedTextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Force re-render fix for mobile browsers
  useEffect(() => {
    if (textareaRef.current && value !== undefined) {
      if (textareaRef.current.value !== value) {
        textareaRef.current.value = String(value);
      }
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      {...props}
      value={value}
      onChange={onChange}
      className={`mobile-optimized-textarea w-full px-4 py-3 border rounded-lg transition-colors ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    />
  );
};

export const MobileOptimizedSelect = ({ 
  className = '', 
  error = false,
  value,
  onChange,
  children,
  ...props 
}: MobileOptimizedSelectProps) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  // Force re-render fix for mobile browsers
  useEffect(() => {
    if (selectRef.current && value !== undefined) {
      if (selectRef.current.value !== value) {
        selectRef.current.value = String(value);
      }
    }
  }, [value]);

  return (
    <select
      ref={selectRef}
      {...props}
      value={value}
      onChange={onChange}
      className={`mobile-optimized-select w-full px-4 py-3 border rounded-lg transition-colors ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      {children}
    </select>
  );
};
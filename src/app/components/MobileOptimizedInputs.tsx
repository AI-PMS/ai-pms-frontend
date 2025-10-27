'use client';

import React, { useState, useRef, useEffect } from 'react';

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

// Enhanced Mobile-Optimized Input with iOS fixes
export const MobileOptimizedInput = ({ 
  className = '', 
  error = false,
  value,
  onChange,
  onBlur,
  ...props 
}: MobileOptimizedInputProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Force re-render on blur to ensure iOS displays the value
    if (inputRef.current) {
      const currentValue = inputRef.current.value;
      setInternalValue(currentValue);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <input
      ref={inputRef}
      {...props}
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`w-full px-4 py-3 border rounded-lg transition-colors mobile-optimized-input ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{
        fontSize: '16px',
        minHeight: '44px',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
        WebkitTapHighlightColor: 'transparent',
        WebkitUserSelect: 'text',
      }}
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
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <textarea
      {...props}
      value={internalValue}
      onChange={handleChange}
      className={`w-full px-4 py-3 border rounded-lg transition-colors mobile-optimized-textarea ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{
        fontSize: '16px',
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
  value,
  onChange,
  ...props 
}: MobileOptimizedSelectProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <select
      {...props}
      value={internalValue}
      onChange={handleChange}
      className={`w-full px-4 py-3 border rounded-lg transition-colors mobile-optimized-select ${className} ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{
        fontSize: '16px',
        minHeight: '44px',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
      }}
    />
  );
};
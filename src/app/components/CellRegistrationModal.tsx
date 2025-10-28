'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Save, AlertCircle, Plus, Minus } from 'lucide-react';
import { MobileOptimizedInput, MobileOptimizedSelect } from './MobileOptimizedInputs';

interface CellCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const CellCreationModal: React.FC<CellCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    cell_number: '',
    block: '',
    capacity: 1,
    status: 'available'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cell_number.trim()) newErrors.cell_number = 'Cell number is required';
    if (!formData.block.trim()) newErrors.block = 'Block is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (formData.capacity > 50) newErrors.capacity = 'Capacity cannot exceed 50';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCapacityChange = (newCapacity: number) => {
    // Ensure capacity stays within bounds
    if (newCapacity >= 1 && newCapacity <= 50) {
      handleInputChange('capacity', newCapacity);
    }
  };

  const incrementCapacity = () => {
    handleCapacityChange(formData.capacity + 1);
  };

  const decrementCapacity = () => {
    handleCapacityChange(formData.capacity - 1);
  };

  const resetForm = () => {
    setFormData({
      cell_number: '',
      block: '',
      capacity: 1,
      status: 'available'
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-modal-overlay">
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal - MOBILE OPTIMIZED WITH SCROLLING */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 flex flex-col mobile-modal-content"
            style={{ maxHeight: '90vh' }}
          >
            {/* Header - FIXED AT TOP */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 sm:p-6 text-white rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Create New Cell</h2>
                    <p className="text-purple-100 text-xs sm:text-sm">Add a new prison cell to the system</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors mobile-action-button"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form Container - SCROLLABLE MIDDLE SECTION */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 mobile-form-scroll" style={{ 
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mobile-form-spacing" id="cell-creation-form">
                {/* Cell Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cell Number *
                  </label>
                  <MobileOptimizedInput
                    type="text"
                    value={formData.cell_number}
                    onChange={(e) => handleInputChange('cell_number', e.target.value)}
                    error={!!errors.cell_number}
                    placeholder="e.g., A101, B205"
                  />
                  {errors.cell_number && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.cell_number}
                    </p>
                  )}
                </div>

                {/* Block */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block *
                  </label>
                  <MobileOptimizedSelect
                    value={formData.block}
                    onChange={(e) => handleInputChange('block', e.target.value)}
                    error={!!errors.block}
                  >
                    <option value="">Select Block</option>
                    <option value="A">Block A</option>
                    <option value="B">Block B</option>
                    <option value="C">Block C</option>
                    <option value="D">Block D</option>
                    <option value="E">Block E</option>
                    <option value="F">Block F</option>
                    <option value="G">Block G</option>
                    <option value="H">Block H</option>
                  </MobileOptimizedSelect>
                  {errors.block && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.block}
                    </p>
                  )}
                </div>

                {/* Capacity - MOBILE OPTIMIZED */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <div className="flex items-center space-x-2">
                    {/* Decrement Button */}
                    <button
                      type="button"
                      onClick={decrementCapacity}
                      disabled={formData.capacity <= 1}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mobile-touch-target"
                      aria-label="Decrease capacity"
                    >
                      <Minus size={16} className="text-gray-700" />
                    </button>

                    {/* Number Input */}
                    <div className="flex-1 relative">
                      <MobileOptimizedInput
                        type="number"
                        min="1"
                        max="50"
                        value={formData.capacity}
                        onChange={(e) => handleCapacityChange(parseInt(e.target.value) || 1)}
                        error={!!errors.capacity}
                        className="text-center"
                      />
                    </div>

                    {/* Increment Button */}
                    <button
                      type="button"
                      onClick={incrementCapacity}
                      disabled={formData.capacity >= 50}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mobile-touch-target"
                      aria-label="Increase capacity"
                    >
                      <Plus size={16} className="text-gray-700" />
                    </button>
                  </div>
                  
                  {errors.capacity && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.capacity}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum capacity: 50 prisoners per cell
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <MobileOptimizedSelect
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="reserved">Reserved</option>
                  </MobileOptimizedSelect>
                  <p className="text-xs text-gray-500 mt-1">
                    Cell status determines availability for prisoner assignment
                  </p>
                </div>

                {/* Spacer to ensure buttons are always visible when scrolling */}
                <div className="h-2"></div>
              </form>
            </div>

            {/* Form Actions - FIXED AT BOTTOM */}
            <div className="border-t border-gray-200 p-4 sm:p-6 bg-white rounded-b-2xl flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mobile-action-button"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="cell-creation-form"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 mobile-action-button"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Create Cell</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CellCreationModal;
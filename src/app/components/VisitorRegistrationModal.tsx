'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Phone, UserCheck, AlertCircle } from 'lucide-react';
import { MobileOptimizedInput, MobileOptimizedTextArea, MobileOptimizedSelect } from './MobileOptimizedInputs';

interface Prisoner {
  id: string;
  prisoner_id: string;
  first_name: string;
  last_name: string;
}

interface VisitorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  prisoners: Prisoner[];
}

const VisitorRegistrationModal: React.FC<VisitorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  prisoners
}) => {
  const [formData, setFormData] = useState({
    prisoner_id: '',
    first_name: '',
    last_name: '',
    relationship: '',
    id_number: '',
    phone: '',
    visit_date: new Date().toISOString().split('T')[0],
    purpose: '',
    items_brought: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentItem, setCurrentItem] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.prisoner_id) newErrors.prisoner_id = 'Prisoner selection is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.relationship) newErrors.relationship = 'Relationship is required';
    if (!formData.id_number) newErrors.id_number = 'ID number is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.visit_date) newErrors.visit_date = 'Visit date is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addItem = () => {
    if (currentItem.trim() && !formData.items_brought.includes(currentItem.trim())) {
      setFormData(prev => ({
        ...prev,
        items_brought: [...prev.items_brought, currentItem.trim()]
      }));
      setCurrentItem('');
    }
  };

  const removeItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      items_brought: prev.items_brought.filter(i => i !== item)
    }));
  };

  const selectedPrisoner = prisoners.find(p => p.id === formData.prisoner_id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 mobile-modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mobile-modal-content"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Register Visitor</h2>
                    <p className="text-green-100 text-sm">Register a new visitor for prisoner visit</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors mobile-action-button"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] mobile-form-scroll">
              <form onSubmit={handleSubmit} className="space-y-6 mobile-form-spacing">
                {/* Prisoner Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Prisoner *
                  </label>
                  <MobileOptimizedSelect
                    value={formData.prisoner_id}
                    onChange={(e) => handleInputChange('prisoner_id', e.target.value)}
                    error={!!errors.prisoner_id}
                  >
                    <option value="">Select a prisoner</option>
                    {prisoners.map((prisoner) => (
                      <option 
                        key={`prisoner-${prisoner.id}-${prisoner.prisoner_id}`} 
                        value={prisoner.prisoner_id}
                      >
                        {prisoner.prisoner_id} - {prisoner.first_name} {prisoner.last_name}
                      </option>
                    ))}
                  </MobileOptimizedSelect>
                  {errors.prisoner_id && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.prisoner_id}
                    </p>
                  )}
                  {selectedPrisoner && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: <span className="font-medium">{selectedPrisoner.first_name} {selectedPrisoner.last_name}</span>
                    </p>
                  )}
                </div>

                {/* Visitor Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Visitor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        error={!!errors.first_name}
                        placeholder="Enter first name"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        error={!!errors.last_name}
                        placeholder="Enter last name"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship to Prisoner *
                      </label>
                      <MobileOptimizedSelect
                        value={formData.relationship}
                        onChange={(e) => handleInputChange('relationship', e.target.value)}
                        error={!!errors.relationship}
                      >
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Child">Child</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Friend">Friend</option>
                        <option value="Lawyer">Lawyer</option>
                        <option value="Other">Other</option>
                      </MobileOptimizedSelect>
                      {errors.relationship && (
                        <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        error={!!errors.phone}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghana Card Number *
                    </label>
                    <MobileOptimizedInput
                      type="text"
                      value={formData.id_number}
                      onChange={(e) => handleInputChange('id_number', e.target.value)}
                      error={!!errors.id_number}
                      placeholder="Enter Ghana Card number"
                    />
                    {errors.id_number && (
                      <p className="text-red-500 text-xs mt-1">{errors.id_number}</p>
                    )}
                  </div>
                </div>

                {/* Visit Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Visit Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visit Date *
                      </label>
                      <MobileOptimizedInput
                        type="date"
                        value={formData.visit_date}
                        onChange={(e) => handleInputChange('visit_date', e.target.value)}
                        error={!!errors.visit_date}
                      />
                      {errors.visit_date && (
                        <p className="text-red-500 text-xs mt-1">{errors.visit_date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visit Purpose *
                      </label>
                      <MobileOptimizedSelect
                        value={formData.purpose}
                        onChange={(e) => handleInputChange('purpose', e.target.value)}
                        error={!!errors.purpose}
                      >
                        <option value="">Select purpose</option>
                        <option value="Family Visit">Family Visit</option>
                        <option value="Legal Consultation">Legal Consultation</option>
                        <option value="Medical Consultation">Medical Consultation</option>
                        <option value="Religious Counseling">Religious Counseling</option>
                        <option value="Other">Other</option>
                      </MobileOptimizedSelect>
                      {errors.purpose && (
                        <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Brought */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Items Brought (Optional)
                  </h3>
                  <div className="flex space-x-2">
                    <MobileOptimizedInput
                      type="text"
                      value={currentItem}
                      onChange={(e) => setCurrentItem(e.target.value)}
                      placeholder="Enter item description"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    />
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mobile-action-button"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.items_brought.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.items_brought.map((item, index) => (
                          <span
                            key={`item-${index}-${item.substring(0, 10)}`}
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeItem(item)}
                              className="ml-2 text-green-600 hover:text-green-800 mobile-action-button"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mobile-action-button"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2 mobile-action-button"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} />
                        <span>Register Visitor</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VisitorRegistrationModal;
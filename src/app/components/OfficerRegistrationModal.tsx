'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, MapPin, Clock, AlertCircle, Plus } from 'lucide-react';
import { MobileOptimizedInput, MobileOptimizedTextArea, MobileOptimizedSelect } from './MobileOptimizedInputs';

interface Officer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}

interface OfficerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  availableOfficers: Officer[];
}

const OfficerRegistrationModal: React.FC<OfficerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  availableOfficers
}) => {
  const [formData, setFormData] = useState({
    officer_id: '',
    officer_name: '',
    officer_phone: '',
    officer_email: '',
    date: new Date().toISOString().split('T')[0],
    shift: 'morning',
    block_assigned: '',
    notes: ''
  });

  const [useExistingOfficer, setUseExistingOfficer] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (useExistingOfficer) {
      if (!formData.officer_id) newErrors.officer_id = 'Officer selection is required';
    } else {
      if (!formData.officer_name.trim()) newErrors.officer_name = 'Officer name is required';
      if (!formData.officer_phone.trim()) newErrors.officer_phone = 'Officer phone is required';
      // Basic phone validation
      if (formData.officer_phone && !/^\+?[\d\s-()]+$/.test(formData.officer_phone)) {
        newErrors.officer_phone = 'Please enter a valid phone number';
      }
    }

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.shift) newErrors.shift = 'Shift is required';
    if (!formData.block_assigned) newErrors.block_assigned = 'Block assignment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        // If using new officer, clear the officer_id and include officer details
        officer_id: useExistingOfficer ? formData.officer_id : '',
        officer_name: useExistingOfficer ? '' : formData.officer_name,
        officer_phone: useExistingOfficer ? '' : formData.officer_phone,
        officer_email: useExistingOfficer ? '' : formData.officer_email,
      };
      onSubmit(submitData);
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

  const selectedOfficer = availableOfficers.find(officer => officer.id === formData.officer_id);

  const resetForm = () => {
    setFormData({
      officer_id: '',
      officer_name: '',
      officer_phone: '',
      officer_email: '',
      date: new Date().toISOString().split('T')[0],
      shift: 'morning',
      block_assigned: '',
      notes: ''
    });
    setUseExistingOfficer(true);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

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
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Assign Officer Duty</h2>
                    <p className="text-orange-100 text-sm">Assign duty schedule to an officer</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors mobile-action-button"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] mobile-form-scroll">
              <form onSubmit={handleSubmit} className="space-y-6 mobile-form-spacing">
                {/* Officer Selection Method */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Officer Assignment Method
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setUseExistingOfficer(true)}
                      className={`flex-1 py-3 px-4 border rounded-lg text-center transition-colors mobile-action-button ${
                        useExistingOfficer
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Select Existing Officer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseExistingOfficer(false)}
                      className={`flex-1 py-3 px-4 border rounded-lg text-center transition-colors mobile-action-button ${
                        !useExistingOfficer
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Plus className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Add New Officer</span>
                    </button>
                  </div>
                </div>

                {/* Officer Selection/Input */}
                {useExistingOfficer ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Officer *
                    </label>
                    <MobileOptimizedSelect
                      value={formData.officer_id}
                      onChange={(e) => handleInputChange('officer_id', e.target.value)}
                      error={!!errors.officer_id}
                    >
                      <option value="">Select an officer</option>
                      {availableOfficers.map((officer) => (
                        <option key={officer.id} value={officer.id}>
                          {officer.first_name} {officer.last_name} - {officer.role}
                        </option>
                      ))}
                    </MobileOptimizedSelect>
                    {errors.officer_id && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.officer_id}
                      </p>
                    )}
                    {selectedOfficer && (
                      <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-orange-900">
                              {selectedOfficer.first_name} {selectedOfficer.last_name}
                            </p>
                            <p className="text-xs text-orange-600">
                              {selectedOfficer.phone} • {selectedOfficer.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Officer Name *
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.officer_name}
                        onChange={(e) => handleInputChange('officer_name', e.target.value)}
                        error={!!errors.officer_name}
                        placeholder="Enter officer's full name"
                      />
                      {errors.officer_name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.officer_name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <MobileOptimizedInput
                          type="tel"
                          value={formData.officer_phone}
                          onChange={(e) => handleInputChange('officer_phone', e.target.value)}
                          error={!!errors.officer_phone}
                          placeholder="e.g., +233 XX XXX XXXX"
                        />
                        {errors.officer_phone && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.officer_phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <MobileOptimizedInput
                          type="email"
                          value={formData.officer_email}
                          onChange={(e) => handleInputChange('officer_email', e.target.value)}
                          placeholder="officer@example.com"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Duty Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Duty Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <MobileOptimizedInput
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        error={!!errors.date}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shift *
                      </label>
                      <MobileOptimizedSelect
                        value={formData.shift}
                        onChange={(e) => handleInputChange('shift', e.target.value)}
                        error={!!errors.shift}
                      >
                        <option value="morning">Morning (06:00 - 14:00)</option>
                        <option value="afternoon">Afternoon (14:00 - 22:00)</option>
                        <option value="night">Night (22:00 - 06:00)</option>
                      </MobileOptimizedSelect>
                      {errors.shift && (
                        <p className="text-red-500 text-xs mt-1">{errors.shift}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Block Assigned *
                      </label>
                      <MobileOptimizedSelect
                        value={formData.block_assigned}
                        onChange={(e) => handleInputChange('block_assigned', e.target.value)}
                        error={!!errors.block_assigned}
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
                        <option value="Administration">Administration</option>
                        <option value="Gate">Gate Security</option>
                      </MobileOptimizedSelect>
                      {errors.block_assigned && (
                        <p className="text-red-500 text-xs mt-1">{errors.block_assigned}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Notes
                  </h3>
                  <MobileOptimizedTextArea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    placeholder="Enter any special instructions or notes for this duty assignment..."
                  />
                </div>

                {/* Form Actions */}
                <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mobile-action-button"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 mobile-action-button ${
                      useExistingOfficer 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <User size={16} />
                        <span>
                          {useExistingOfficer ? 'Assign Duty' : 'Assign to New Officer'}
                        </span>
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

export default OfficerRegistrationModal;
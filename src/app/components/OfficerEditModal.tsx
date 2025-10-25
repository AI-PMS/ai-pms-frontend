'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, MapPin, Clock, Save, AlertCircle, Mail, Phone } from 'lucide-react';

interface OfficerDuty {
  id: string;
  officer_id: string;
  officer_name: string;
  officer_phone: string;
  officer_email: string;
  date: string;
  shift: string;
  block_assigned: string;
  notes?: string;
  created_at: string;
}

interface OfficerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dutyId: string, data: any) => void;
  isLoading: boolean;
  duty: OfficerDuty | null;
}

const OfficerEditModal: React.FC<OfficerEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  duty
}) => {
  const [formData, setFormData] = useState({
    date: '',
    shift: 'morning',
    block_assigned: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.shift) newErrors.shift = 'Shift is required';
    if (!formData.block_assigned) newErrors.block_assigned = 'Block assignment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && duty) {
      onSubmit(duty.id, formData);
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

  // Initialize form data when duty changes
  useEffect(() => {
    if (duty) {
      setFormData({
        date: duty.date.split('T')[0],
        shift: duty.shift,
        block_assigned: duty.block_assigned,
        notes: duty.notes || ''
      });
    }
  }, [duty]);

  if (!duty) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Edit Duty Assignment</h2>
                    <p className="text-orange-100 text-sm">Update officer duty schedule</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Officer Information - Display Only */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Officer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Officer Name</p>
                      <p className="text-lg font-bold text-orange-900">{duty.officer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-orange-800">Contact Information</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone size={14} className="text-orange-600" />
                        <span className="text-orange-900">{duty.officer_phone}</span>
                      </div>
                      {duty.officer_email && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail size={14} className="text-orange-600" />
                          <span className="text-orange-900">{duty.officer_email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Current Assignment Info */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Assignment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{duty.date.split('T')[0]}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Shift:</span>
                      <span className="ml-2 font-medium capitalize">{duty.shift}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Block:</span>
                      <span className="ml-2 font-medium">{duty.block_assigned}</span>
                    </div>
                  </div>
                </div>

                {/* Duty Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Update Duty Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          errors.date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shift *
                      </label>
                      <select
                        value={formData.shift}
                        onChange={(e) => handleInputChange('shift', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          errors.shift ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="morning">Morning (06:00 - 14:00)</option>
                        <option value="afternoon">Afternoon (14:00 - 22:00)</option>
                        <option value="night">Night (22:00 - 06:00)</option>
                      </select>
                      {errors.shift && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.shift}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Block Assigned *
                      </label>
                      <select
                        value={formData.block_assigned}
                        onChange={(e) => handleInputChange('block_assigned', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          errors.block_assigned ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                      </select>
                      {errors.block_assigned && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.block_assigned}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Notes
                  </h3>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter any special instructions or notes for this duty assignment..."
                  />
                </div>

                {/* Form Actions */}
                <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Update Duty</span>
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

export default OfficerEditModal;
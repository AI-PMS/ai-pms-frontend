'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Phone, UserCheck, Save, AlertCircle } from 'lucide-react';

interface Visitor {
  id: string;
  prisoner_id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  id_number: string;
  phone: string;
  visit_date: string;
  purpose: string;
  items_brought?: string[];
  approved: boolean;
  prisoner_name?: string;
}

interface VisitorEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  visitor: Visitor | null;
}

const VisitorEditModal: React.FC<VisitorEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  visitor
}) => {
  const [formData, setFormData] = useState({
    prisoner_id: '',
    first_name: '',
    last_name: '',
    relationship: '',
    id_number: '',
    phone: '',
    visit_date: '',
    purpose: '',
    items_brought: [] as string[],
    approved: false
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field as string]) {
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

  // Initialize form data when visitor changes
  useEffect(() => {
    if (visitor) {
      setFormData({
        prisoner_id: visitor.prisoner_id,
        first_name: visitor.first_name,
        last_name: visitor.last_name,
        relationship: visitor.relationship,
        id_number: visitor.id_number,
        phone: visitor.phone,
        visit_date: visitor.visit_date.split('T')[0],
        purpose: visitor.purpose,
        items_brought: visitor.items_brought || [],
        approved: visitor.approved
      });
    }
  }, [visitor]);

  if (!visitor) return null;

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
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Edit Visitor Details</h2>
                    <p className="text-green-100 text-sm">Update visitor information</p>
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
                {/* Prisoner Information */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">
                        Visiting: {visitor.prisoner_name}
                      </h3>
                      <p className="text-sm text-green-600">Prisoner ID: {visitor.prisoner_id}</p>
                    </div>
                  </div>
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
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                          errors.first_name ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                          errors.last_name ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                      <select
                        value={formData.relationship}
                        onChange={(e) => handleInputChange('relationship', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                          errors.relationship ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Child">Child</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Friend">Friend</option>
                        <option value="Lawyer">Lawyer</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.relationship && (
                        <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                    <input
                      type="text"
                      value={formData.id_number}
                      onChange={(e) => handleInputChange('id_number', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.id_number ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                      <input
                        type="date"
                        value={formData.visit_date}
                        onChange={(e) => handleInputChange('visit_date', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                          errors.visit_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.visit_date && (
                        <p className="text-red-500 text-xs mt-1">{errors.visit_date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visit Purpose *
                      </label>
                      <select
                        value={formData.purpose}
                        onChange={(e) => handleInputChange('purpose', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                          errors.purpose ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select purpose</option>
                        <option value="Family Visit">Family Visit</option>
                        <option value="Legal Consultation">Legal Consultation</option>
                        <option value="Medical Consultation">Medical Consultation</option>
                        <option value="Religious Counseling">Religious Counseling</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.purpose && (
                        <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Approval Status */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Approval Status
                  </h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="approved"
                      checked={formData.approved}
                      onChange={(e) => handleInputChange('approved', e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor="approved" className="text-sm font-medium text-gray-700">
                      Approve this visitor
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    When approved, this visitor will be allowed to visit the prisoner on the scheduled date.
                  </p>
                </div>

                {/* Items Brought */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Items Brought (Optional)
                  </h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentItem}
                      onChange={(e) => setCurrentItem(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter item description"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    />
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.items_brought.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.items_brought.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeItem(item)}
                              className="ml-2 text-green-600 hover:text-green-800"
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
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Update Visitor</span>
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

export default VisitorEditModal;
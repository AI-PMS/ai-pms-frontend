'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, MapPin, Shield, AlertCircle } from 'lucide-react';
import { MobileOptimizedInput, MobileOptimizedTextArea, MobileOptimizedSelect } from '../page'; // Import from your page

interface PrisonerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const PrisonerRegistrationModal: React.FC<PrisonerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    prisoner_id: '',
    first_name: '',
    last_name: '',
    other_names: '',
    gender: 'male',
    date_of_birth: '',
    nationality: 'Ghanaian',
    id_number: '',
    crime: '',
    sentence_duration: '',
    date_admitted: new Date().toISOString().split('T')[0],
    cell_id: '',
    medical_conditions: [] as string[],
    emergency_contact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentMedicalCondition, setCurrentMedicalCondition] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.prisoner_id) newErrors.prisoner_id = 'Prisoner ID is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.id_number) newErrors.id_number = 'ID number is required';
    if (!formData.crime) newErrors.crime = 'Crime is required';
    if (!formData.sentence_duration) newErrors.sentence_duration = 'Sentence duration is required';
    if (!formData.date_admitted) newErrors.date_admitted = 'Date admitted is required';
    if (!formData.cell_id) newErrors.cell_id = 'Cell ID is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addMedicalCondition = () => {
    if (currentMedicalCondition.trim() && !formData.medical_conditions.includes(currentMedicalCondition.trim())) {
      setFormData(prev => ({
        ...prev,
        medical_conditions: [...prev.medical_conditions, currentMedicalCondition.trim()]
      }));
      setCurrentMedicalCondition('');
    }
  };

  const removeMedicalCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      medical_conditions: prev.medical_conditions.filter(c => c !== condition)
    }));
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

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergency_contact: {
        ...prev.emergency_contact,
        [field]: value
      }
    }));
  };

  useEffect(() => {
    if (isOpen) {
      // Generate a prisoner ID when modal opens
      const generatedId = `PR${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, prisoner_id: generatedId }));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Register New Prisoner</h2>
                    <p className="text-blue-100 text-sm">Fill in the prisoner details below</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Prisoner ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prisoner ID *
                    </label>
                    <MobileOptimizedInput
                      type="text"
                      value={formData.prisoner_id}
                      onChange={(e) => handleInputChange('prisoner_id', e.target.value)}
                      error={!!errors.prisoner_id}
                      placeholder="Auto-generated prisoner ID"
                      readOnly
                    />
                    {errors.prisoner_id && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.prisoner_id}
                      </p>
                    )}
                  </div>

                  {/* Cell ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cell Number *
                    </label>
                    <MobileOptimizedInput
                      type="text"
                      value={formData.cell_id}
                      onChange={(e) => handleInputChange('cell_id', e.target.value)}
                      error={!!errors.cell_id}
                      placeholder="e.g., A101"
                    />
                    {errors.cell_id && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.cell_id}
                      </p>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Names
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.other_names}
                        onChange={(e) => handleInputChange('other_names', e.target.value)}
                        placeholder="Enter other names"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <MobileOptimizedSelect
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </MobileOptimizedSelect>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <MobileOptimizedInput
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        error={!!errors.date_of_birth}
                      />
                      {errors.date_of_birth && (
                        <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="Enter nationality"
                      />
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

                {/* Legal Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Legal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Crime Committed *
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.crime}
                        onChange={(e) => handleInputChange('crime', e.target.value)}
                        error={!!errors.crime}
                        placeholder="Enter crime description"
                      />
                      {errors.crime && (
                        <p className="text-red-500 text-xs mt-1">{errors.crime}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sentence Duration *
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.sentence_duration}
                        onChange={(e) => handleInputChange('sentence_duration', e.target.value)}
                        error={!!errors.sentence_duration}
                        placeholder="e.g., 5 years, Life imprisonment"
                      />
                      {errors.sentence_duration && (
                        <p className="text-red-500 text-xs mt-1">{errors.sentence_duration}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Admitted *
                    </label>
                    <MobileOptimizedInput
                      type="date"
                      value={formData.date_admitted}
                      onChange={(e) => handleInputChange('date_admitted', e.target.value)}
                      error={!!errors.date_admitted}
                    />
                    {errors.date_admitted && (
                      <p className="text-red-500 text-xs mt-1">{errors.date_admitted}</p>
                    )}
                  </div>
                </div>

                {/* Medical Conditions */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Medical Conditions
                  </h3>
                  <div className="flex space-x-2">
                    <MobileOptimizedInput
                      type="text"
                      value={currentMedicalCondition}
                      onChange={(e) => setCurrentMedicalCondition(e.target.value)}
                      placeholder="Enter medical condition"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalCondition())}
                    />
                    <button
                      type="button"
                      onClick={addMedicalCondition}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.medical_conditions.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.medical_conditions.map((condition, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {condition}
                            <button
                              type="button"
                              onClick={() => removeMedicalCondition(condition)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.emergency_contact.name}
                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                        placeholder="Enter contact name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.emergency_contact.phone}
                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <MobileOptimizedInput
                        type="text"
                        value={formData.emergency_contact.relationship}
                        onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                        placeholder="e.g., Spouse, Parent"
                      />
                    </div>
                  </div>
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <User size={16} />
                        <span>Register Prisoner</span>
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

export default PrisonerRegistrationModal;
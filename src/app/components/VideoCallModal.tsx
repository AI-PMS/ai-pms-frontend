'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Calendar, Clock, User, Phone, MessageCircle } from 'lucide-react';

interface Prisoner {
  id: string;
  prisoner_id: string;
  first_name: string;
  last_name: string;
}

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  prisoner?: Prisoner | null;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  prisoner
}) => {
  const [formData, setFormData] = useState({
    prisoner_id: prisoner?.id || '',
    scheduled_time: '',
    purpose: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.prisoner_id) newErrors.prisoner_id = 'Prisoner selection is required';
    if (!formData.scheduled_time) newErrors.scheduled_time = 'Scheduled time is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        meeting_url: `https://meet.ghana-prison.gov.gh/${Date.now()}`
      });
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

  // Set prisoner ID when prisoner prop changes
  React.useEffect(() => {
    if (prisoner) {
      setFormData(prev => ({ ...prev, prisoner_id: prisoner.id }));
    }
  }, [prisoner]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Video size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Schedule Video Call</h2>
                    <p className="text-purple-100 text-sm">Schedule a video call with prisoner</p>
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
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Prisoner Information */}
                {prisoner && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-900">
                          {prisoner.first_name} {prisoner.last_name}
                        </h3>
                        <p className="text-sm text-purple-600">Prisoner ID: {prisoner.prisoner_id}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scheduled Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_time}
                    onChange={(e) => handleInputChange('scheduled_time', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.scheduled_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.scheduled_time && (
                    <p className="text-red-500 text-xs mt-1">{errors.scheduled_time}</p>
                  )}
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose of Call *
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.purpose ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select purpose</option>
                    <option value="Legal Consultation">Legal Consultation</option>
                    <option value="Family Communication">Family Communication</option>
                    <option value="Medical Consultation">Medical Consultation</option>
                    <option value="Psychological Evaluation">Psychological Evaluation</option>
                    <option value="Administrative Review">Administrative Review</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.purpose && (
                    <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Any additional notes or special instructions..."
                  />
                </div>

                {/* Meeting Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-purple-600" />
                    Meeting Information
                  </h4>
                  <p className="text-sm text-gray-600">
                    A secure video meeting link will be generated automatically after scheduling.
                    Both parties will receive notification with joining instructions.
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
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
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Scheduling...</span>
                      </>
                    ) : (
                      <>
                        <Video size={16} />
                        <span>Schedule Call</span>
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

export default VideoCallModal;
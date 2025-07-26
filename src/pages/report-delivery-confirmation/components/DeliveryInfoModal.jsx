import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { submitDeliveryRequest } from '../../../services/web3FormsService';

const DeliveryInfoModal = ({ isOpen, onClose, onSubmit, profession = 'teacher', calculationResults = null }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit to Web3Forms
      const result = await submitDeliveryRequest({
        email: email.trim(),
        profession,
        calculationResults
      });
      
      if (result.success) {
        console.log('Delivery request submitted successfully:', result.data);
        onSubmit(email);
      } else {
        console.error('Delivery request failed:', result.error);
        setError(result.error || 'Failed to send report. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Delivery request error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail('');
      setError('');
      onClose();
    }
  };

  const getProfessionTitle = () => {
    const titles = {
      teacher: 'Educator',
      nurse: 'Healthcare Professional',
      'first-responder': 'First Responder',
      'government-employee': 'Public Service Professional'
    };
    return titles[profession] || titles.teacher;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="Mail" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Send Your Report</h2>
                <p className="text-sm text-text-secondary">Enter your email to receive your personalized analysis</p>
              </div>
            </div>
            {!isSubmitting && (
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                aria-label="Close modal"
              >
                <Icon name="X" size={20} className="text-text-secondary" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Mail" size={18} className="text-text-secondary" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={isSubmitting}
                className={`input-field w-full pl-10 pr-4 py-3 ${
                  error ? 'border-error focus:border-error focus:ring-error-100' : ''
                } ${isSubmitting ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                autoFocus
              />
            </div>
            {error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-error">
                <Icon name="AlertCircle" size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Report Preview */}
          <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-start gap-3">
              <Icon name="FileText" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-primary mb-1">Your Personalized Report Includes:</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Complete retirement gap analysis</li>
                  <li>• {getProfessionTitle()}-specific recommendations</li>
                  <li>• Detailed action plan with next steps</li>
                  <li>• Risk assessment and projections</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mb-6 p-3 bg-secondary-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Shield" size={16} className="text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary">
                Your email is secure and will only be used to send your report. We never share your information.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary hover:bg-primary-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Report...</span>
              </>
            ) : (
              <>
                <Icon name="Send" size={18} />
                <span>Send My Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryInfoModal;

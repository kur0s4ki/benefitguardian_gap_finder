import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const EmailReportModal = ({ isOpen, onClose, onSubmit, profession = 'teacher' }) => {
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
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ email: email.trim() });
      onClose();
    } catch (error) {
      console.error('Error submitting email:', error);
      setError('Failed to send report. Please try again.');
    } finally {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="Mail" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Email My Report
              </h2>
              <p className="text-sm text-text-secondary">
                Get your detailed analysis delivered instantly
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Benefits */}
          <div className="space-y-3">
            <h3 className="font-medium text-text-primary">What you'll receive:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span>Comprehensive 15-page gap analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span>Personalized action recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span>Retirement planning strategies</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span>Instant delivery to your inbox</span>
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ${
                error ? 'border-error' : 'border-border'
              }`}
              disabled={isSubmitting}
              autoFocus
            />
            {error && (
              <p className="text-sm text-error flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                {error}
              </p>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-primary-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Shield" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-primary-700">
                <p className="font-medium mb-1">Your privacy is protected</p>
                <p>We'll only use your email to send your report and occasional retirement planning tips. You can unsubscribe anytime.</p>
              </div>
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

export default EmailReportModal;

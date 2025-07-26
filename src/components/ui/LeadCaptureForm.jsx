import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useToast } from './ToastProvider';
import { submitLeadForm } from '../../services/web3FormsService';

const LeadCaptureForm = ({ 
  title = "Get Your Complete Analysis",
  subtitle = "Enter your email to access the full retirement gap analysis",
  onSubmit,
  className = ""
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !name) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    if (!email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Web3Forms
      const result = await submitLeadForm({ email, name });
      
      if (result.success) {
        console.log('Lead form submitted successfully:', result.data);
        
        if (onSubmit) {
          await onSubmit({ email, name });
        }

        setIsSubmitted(true);
        addToast('Thank you! Check your email for next steps.', 'success');
      } else {
        console.error('Lead form submission failed:', result.error);
        addToast(result.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Lead form error:', error);
      addToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        className={`p-6 lg:p-8 bg-success-50 border border-success-200 rounded-xl text-center ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Check" size={32} className="text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-success-800 mb-2">
          Thank You!
        </h3>
        
        <p className="text-success-700 mb-4">
          We've sent you information about accessing the complete analysis. 
          Check your email for next steps.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-success-600">
          <Icon name="Mail" size={16} />
          <span>Sent to: {email}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`p-6 lg:p-8 bg-surface border border-border rounded-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon name="Mail" size={24} className="text-primary" />
        </div>
        
        <h3 className="text-xl font-bold text-text-primary mb-2">
          {title}
        </h3>
        
        <p className="text-text-secondary">
          {subtitle}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full"
            placeholder="Enter your email address"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Icon name="ArrowRight" size={20} />
              <span>Get Complete Analysis</span>
            </div>
          )}
        </button>
      </form>

      {/* Trust Indicators */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Icon name="Shield" size={16} className="text-primary mb-1" />
            <span className="text-xs text-text-secondary">Secure</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon name="Lock" size={16} className="text-primary mb-1" />
            <span className="text-xs text-text-secondary">Private</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon name="Award" size={16} className="text-primary mb-1" />
            <span className="text-xs text-text-secondary">Professional</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-text-muted text-center">
        By submitting this form, you agree to receive information about our retirement planning services. 
        We respect your privacy and will never share your information.
      </p>
    </motion.div>
  );
};

export default LeadCaptureForm;

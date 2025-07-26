// Web3Forms Service for handling email submissions
const WEB3FORMS_ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";

/**
 * Submit form data to Web3Forms
 * @param {Object} formData - Form data to submit
 * @param {string} formType - Type of form (contact, lead, report, etc.)
 * @returns {Promise<Object>} - Response from Web3Forms API
 */
export const submitToWeb3Forms = async (formData, formType = 'contact') => {
  try {
    // Prepare the form data for Web3Forms
    const web3FormsData = new FormData();
    
    // Required access key
    web3FormsData.append('access_key', WEB3FORMS_ACCESS_KEY);
    
    // Custom subjects based on form type
    const subjects = {
      contact: 'New Contact Form Submission - BenefitGuardian',
      lead: 'New Lead Capture - BenefitGuardian',
      report: 'Report Request - BenefitGuardian',
      delivery: 'Report Delivery Request - BenefitGuardian'
    };
    
    web3FormsData.append('subject', subjects[formType] || subjects.contact);
    web3FormsData.append('from_name', 'BenefitGuardian Gap Finder');
    
    // Bot check (hidden field for spam protection)
    web3FormsData.append('botcheck', '');
    
    // Add form-specific data
    switch (formType) {
      case 'contact':
        web3FormsData.append('name', formData.name || '');
        web3FormsData.append('email', formData.email || '');
        web3FormsData.append('phone', formData.phone || '');
        web3FormsData.append('message', formData.message || '');
        web3FormsData.append('form_type', 'Contact Form');
        break;
        
      case 'lead':
        web3FormsData.append('name', formData.name || '');
        web3FormsData.append('email', formData.email || '');
        web3FormsData.append('form_type', 'Lead Capture');
        web3FormsData.append('message', 'Lead interested in retirement gap analysis');
        break;
        
      case 'report':
      case 'delivery':
        web3FormsData.append('email', formData.email || '');
        web3FormsData.append('form_type', formType === 'report' ? 'Email Report Request' : 'Report Delivery Request');
        web3FormsData.append('message', `Report request for ${formData.email}`);
        web3FormsData.append('profession', formData.profession || 'Not specified');
        
        // Add calculation results if available
        if (formData.calculationResults) {
          web3FormsData.append('risk_score', formData.calculationResults.riskScore || 'N/A');
          web3FormsData.append('total_gap', formData.calculationResults.totalGap || 'N/A');
          web3FormsData.append('pension_gap', formData.calculationResults.pensionGap || 'N/A');
        }
        break;
        
      default:
        // Generic form handling
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined) {
            web3FormsData.append(key, formData[key]);
          }
        });
    }
    
    // Add timestamp
    web3FormsData.append('submission_time', new Date().toISOString());
    
    // Submit to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: web3FormsData
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit form');
    }
    
    return {
      success: true,
      data: result
    };
    
  } catch (error) {
    console.error('Web3Forms submission error:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit form. Please try again.'
    };
  }
};

/**
 * Submit contact form
 */
export const submitContactForm = (formData) => {
  return submitToWeb3Forms(formData, 'contact');
};

/**
 * Submit lead capture form
 */
export const submitLeadForm = (formData) => {
  return submitToWeb3Forms(formData, 'lead');
};

/**
 * Submit email report request
 */
export const submitReportRequest = (formData) => {
  return submitToWeb3Forms(formData, 'report');
};

/**
 * Submit report delivery request
 */
export const submitDeliveryRequest = (formData) => {
  return submitToWeb3Forms(formData, 'delivery');
};

export default {
  submitToWeb3Forms,
  submitContactForm,
  submitLeadForm,
  submitReportRequest,
  submitDeliveryRequest
}; 
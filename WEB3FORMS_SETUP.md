# Web3Forms Integration Guide

This document explains how to set up and use Web3Forms for email submissions in the BenefitGuardian Gap Finder application.

## Overview

The application uses Web3Forms to handle all email form submissions without requiring a backend server. Web3Forms is a contact form API that delivers form submissions directly to your email.

## Setup Instructions

### 1. Get Web3Forms Access Key

1. Visit [Web3Forms.com](https://web3forms.com/)
2. Sign up for a free account
3. Create a new form and get your access key
4. The free plan includes:
   - 250 submissions per month
   - Email notifications
   - Spam protection
   - No file attachments

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Web3Forms access key to `.env.local`:
   ```env
   REACT_APP_WEB3FORMS_ACCESS_KEY=your_actual_access_key_here
   ```

3. Restart your development server after adding the environment variable.

### 3. Verify Setup

1. Start the application: `npm start`
2. Test any contact form in the application
3. Check your email for form submissions
4. Check browser console for success/error messages

## Available Forms

The application has integrated Web3Forms with the following forms:

### 1. Contact Popup (`ContactPopup.jsx`)
- **Location**: Available via header/footer contact buttons
- **Fields**: Name, Email, Phone, Message
- **Purpose**: General contact and inquiries
- **Email Subject**: "New Contact Form Submission - BenefitGuardian"

### 2. Lead Capture Form (`LeadCaptureForm.jsx`)
- **Location**: Various landing pages and CTAs
- **Fields**: Name, Email
- **Purpose**: Lead generation for retirement analysis
- **Email Subject**: "New Lead Capture - BenefitGuardian"

### 3. Email Report Modal (`EmailReportModal.jsx`)
- **Location**: Dynamic results dashboard
- **Fields**: Email, Profession, Calculation Results
- **Purpose**: Request detailed retirement gap report
- **Email Subject**: "Report Request - BenefitGuardian"

### 4. Delivery Info Modal (`DeliveryInfoModal.jsx`)
- **Location**: Report delivery confirmation page
- **Fields**: Email, Profession, Calculation Results
- **Purpose**: Report delivery requests
- **Email Subject**: "Report Delivery Request - BenefitGuardian"

## Form Data Structure

Each form type sends different data to Web3Forms:

### Contact Form Data
```javascript
{
  access_key: "your_access_key",
  subject: "New Contact Form Submission - BenefitGuardian",
  from_name: "BenefitGuardian Gap Finder",
  name: "User Name",
  email: "user@example.com",
  phone: "Optional phone number",
  message: "User message",
  form_type: "Contact Form",
  submission_time: "2024-01-15T10:30:00.000Z"
}
```

### Lead Capture Data
```javascript
{
  access_key: "your_access_key",
  subject: "New Lead Capture - BenefitGuardian",
  from_name: "BenefitGuardian Gap Finder",
  name: "User Name",
  email: "user@example.com",
  form_type: "Lead Capture",
  message: "Lead interested in retirement gap analysis",
  submission_time: "2024-01-15T10:30:00.000Z"
}
```

### Report Request Data
```javascript
{
  access_key: "your_access_key",
  subject: "Report Request - BenefitGuardian",
  from_name: "BenefitGuardian Gap Finder",
  email: "user@example.com",
  profession: "teacher",
  form_type: "Email Report Request",
  message: "Report request for user@example.com",
  risk_score: "65",
  total_gap: "125000",
  pension_gap: "850",
  submission_time: "2024-01-15T10:30:00.000Z"
}
```

## Service Functions

The `web3FormsService.js` provides these functions:

- `submitContactForm(formData)` - For contact forms
- `submitLeadForm(formData)` - For lead capture
- `submitReportRequest(formData)` - For report requests
- `submitDeliveryRequest(formData)` - For delivery requests
- `submitToWeb3Forms(formData, formType)` - Generic submission

## Error Handling

All forms include comprehensive error handling:

1. **Validation Errors**: Client-side validation before submission
2. **Network Errors**: Handled with retry suggestions
3. **API Errors**: Web3Forms API error messages displayed to users
4. **Success States**: Clear confirmation messages and UI updates

## Testing

To test the integration:

1. **Development**: Use your actual Web3Forms key in development
2. **Production**: Ensure environment variables are set in your hosting platform
3. **Form Testing**: Submit test data through each form type
4. **Email Verification**: Check that emails arrive with correct formatting

## Upgrading Web3Forms

For higher volume or additional features:

1. **Pro Plan**: $8/month for 1,000 submissions
2. **Business Plan**: $15/month for 5,000 submissions
3. **Additional Features**: File uploads, webhooks, custom redirects

## Security Notes

- Access keys can be public (they're designed for frontend use)
- Includes built-in spam protection
- Bot check field automatically included
- No sensitive data should be transmitted through forms

## Troubleshooting

### Common Issues

1. **Forms not submitting**: Check access key in environment variables
2. **No emails received**: Check spam folder, verify access key
3. **Console errors**: Check network connection, API status
4. **Environment variables**: Ensure `.env.local` is not in `.gitignore`

### Debug Steps

1. Check browser console for error messages
2. Verify environment variable is loaded: `console.log(process.env.REACT_APP_WEB3FORMS_ACCESS_KEY)`
3. Test with minimal form data first
4. Check Web3Forms dashboard for submission logs

## Support

- Web3Forms Documentation: https://docs.web3forms.com/
- Web3Forms Support: https://web3forms.com/contact
- BenefitGuardian Support: Support@publicservwealth.com 
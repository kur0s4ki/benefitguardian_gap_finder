# Calculation Engine & PDF Report Implementation

This document tracks the analysis, refactoring, and feature implementation for the core calculation logic and the client-side PDF reporting.

## Completed Tasks

- [x] **Analysis & Refactoring:**
  - [x] Mapped the end-to-end calculation data flow.
  - [x] Corrected inverted `survivorRisk` logic.
  - [x] Clamped `gapClosure` percentage to a 0-100 range.
  - [x] Clamped final `riskScore` to a 0-100 range.
- [x] **Input & Validation:**
  - [x] Added a "Current Age" input to the questionnaire.
  - [x] Replaced hardcoded default age with the new dynamic value.
  - [x] Added validation to ensure `retirementAge` > `currentAge`.
  - [x] Hooked `validateUserData` into the form submission process.
  - [x] Fixed validation warnings for pension/savings appearing incorrectly.
- [x] **UI & UX:**
  - [x] Restored original UI for the `RetirementAgeSection` component.
  - [x] Implemented a "Current Age" slider with a consistent design.
  - [x] Replaced browser alerts with a dismissible toast notification system.
  - [x] Fixed toast visibility by increasing its `z-index`.
  - [x] Corrected UI display of risk components and contribution recommendations.
  - [x] Enhanced pension estimate input with 4 common range buttons ($1,500-$5,000).
  - [x] Styled pension range buttons consistently with years of service buttons.
  - [x] Optimized mobile responsive design with proper padding and native app feel.
- [x] **Features & Debugging:**
  - [x] Implemented a detailed calculation log within the engine.
  - [x] Displayed the calculation log on the report delivery page.
  - [x] Created a client-side PDF report generator.
  - [x] Fixed data flow to ensure the PDF generator receives complete, raw data.

## Future Tasks

- [ ] Integrate PDF generation into the email sending flow (server-side).
- [ ] Add loading indicators for PDF generation and download.
- [ ] Refine the visual design and layout of the generated PDF.

## Implementation Plan

The core calculation engine has been stabilized and validated. The primary remaining work involves enhancing the PDF reporting feature.

### 1. Stabilize Client-Side PDF
The `reportGenerator.js` utility is functional. The immediate next step is to add loading states to the UI when the `downloadFullReport` function is invoked to improve user feedback, as PDF generation can take a moment.

### 2. Server-Side PDF Generation
For a more robust solution, the `generateFullReport` function (or a server-side equivalent) should be hooked into a backend service. When a user requests their report via email, the server should:
1. Receive the `userData` payload.
2. Generate the PDF document.
3. Attach it to an email and send it to the user.
This decouples the PDF generation from the client and provides a more reliable delivery mechanism.

### Relevant Files

- `src/utils/calculationEngine.js` - The core logic for all gap and risk calculations. Contains the logging mechanism.
- `src/utils/reportGenerator.js` - Utility to generate a PDF report from calculation results.
- `src/pages/risk-assessment-questionnaire/index.jsx` - Main questionnaire page where user input is collected and validated.
- `src/pages/risk-assessment-questionnaire/components/RetirementAgeSection.jsx` - The UI component containing the sliders for current and retirement age.
- `src/pages/report-delivery-confirmation/index.jsx` - The final page where the user can download their PDF report and view the calculation log.
- `src/components/ui/ToastProvider.jsx` - The component that provides dismissible toast notifications for validation warnings and errors. 
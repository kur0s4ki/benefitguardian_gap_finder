import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import ProfessionSelectionLanding from "pages/profession-selection-landing";
import ServiceProfileCollection from "pages/service-profile-collection";
import RiskAssessmentQuestionnaire from "pages/risk-assessment-questionnaire";
import DynamicResultsDashboard from "pages/dynamic-results-dashboard";
import GapCalculatorTool from "pages/gap-calculator-tool";
import ReportDeliveryConfirmation from "pages/report-delivery-confirmation";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<ProfessionSelectionLanding />} />
          <Route path="/profession-selection-landing" element={<ProfessionSelectionLanding />} />
          <Route path="/service-profile-collection" element={<ServiceProfileCollection />} />
          <Route path="/risk-assessment-questionnaire" element={<RiskAssessmentQuestionnaire />} />
          <Route path="/dynamic-results-dashboard" element={<DynamicResultsDashboard />} />
          <Route path="/gap-calculator-tool" element={<GapCalculatorTool />} />
          <Route path="/report-delivery-confirmation" element={<ReportDeliveryConfirmation />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
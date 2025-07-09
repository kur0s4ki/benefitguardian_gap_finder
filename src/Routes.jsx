import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

// Page imports
import ProfessionSelectionLanding from "pages/profession-selection-landing";
import ServiceProfileCollection from "pages/service-profile-collection";
import RiskAssessmentQuestionnaire from "pages/risk-assessment-questionnaire";
import DynamicResultsDashboard from "pages/dynamic-results-dashboard";
import GapCalculatorTool from "pages/gap-calculator-tool";
import ReportDeliveryConfirmation from "pages/report-delivery-confirmation";
import PrivacyPolicy from "pages/privacy-policy";
import TermsOfService from "pages/terms-of-service";
import Disclosures from "pages/disclosures";
import Contact from "pages/contact";
import Login from "pages/login";
import UserManagement from "pages/user-management";
import ManageMyProfile from "pages/manage-my-profile";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<ProfessionSelectionLanding />} />
          <Route
            path="/profession-selection-landing"
            element={<ProfessionSelectionLanding />}
          />
          <Route
            path="/service-profile-collection"
            element={<ServiceProfileCollection />}
          />
          <Route
            path="/risk-assessment-questionnaire"
            element={<RiskAssessmentQuestionnaire />}
          />
          <Route
            path="/dynamic-results-dashboard"
            element={<DynamicResultsDashboard />}
          />
          <Route path="/gap-calculator-tool" element={<GapCalculatorTool />} />
          <Route
            path="/report-delivery-confirmation"
            element={<ReportDeliveryConfirmation />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/manage-my-profile" element={<ManageMyProfile />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/disclosures" element={<Disclosures />} />
          <Route path="/contact" element={<Contact />} />
          {/* Catch-all route for 404 pages */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

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
import ProtectedRoute from "components/auth/ProtectedRoute";
import RoleGuard from "components/auth/RoleGuard";
import { ROLES } from "utils/roles";

// Page imports
import Login from "pages/login";
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
import AdminDashboard from "pages/admin";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/disclosures" element={<Disclosures />} />
          <Route path="/contact" element={<Contact />} />

          {/* Public routes - no authentication required */}
          <Route path="/" element={<ProfessionSelectionLanding />} />
          <Route
            path="/profession-selection-landing"
            element={<ProfessionSelectionLanding />}
          />

          {/* Public assessment routes - allow both public and authenticated access */}
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
          <Route
            path="/report-delivery-confirmation"
            element={<ReportDeliveryConfirmation />}
          />

          {/* Protected routes - require authentication and specific roles */}
          <Route
            path="/gap-calculator-tool"
            element={
              <ProtectedRoute>
                <RoleGuard
                  requiredRole={ROLES.PREMIUM}
                  showToast={true}
                  toastMessage="Premium access required for the Gap Calculator Tool"
                >
                  <GapCalculatorTool />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Admin routes - require admin role */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard
                  requiredRole={ROLES.ADMIN}
                  showToast={true}
                  toastMessage="Administrator access required"
                >
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 pages */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

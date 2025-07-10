import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/auth/ProtectedRoute";
import NotFound from "pages/NotFound";

// Authentication pages
import Login from "pages/login";
import Register from "pages/register";
import PendingApproval from "pages/pending-approval";
import Dashboard from "pages/dashboard";
import UserManagement from "pages/admin/user-management";

// Assessment pages
import ProfessionSelectionLanding from "pages/profession-selection-landing";
import ServiceProfileCollection from "pages/service-profile-collection";
import RiskAssessmentQuestionnaire from "pages/risk-assessment-questionnaire";
import DynamicResultsDashboard from "pages/dynamic-results-dashboard";
import GapCalculatorTool from "pages/gap-calculator-tool";
import ReportDeliveryConfirmation from "pages/report-delivery-confirmation";

// Static pages
import PrivacyPolicy from "pages/privacy-policy";
import TermsOfService from "pages/terms-of-service";
import Disclosures from "pages/disclosures";
import Contact from "pages/contact";


const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approval" element={
            <ProtectedRoute requireApproval={false}>
              <PendingApproval />
            </ProtectedRoute>
          } />

          {/* Protected routes - require authentication and approval */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/user-management" element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          } />

          {/* Root route - redirect to dashboard if authenticated */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profession-selection-landing" element={
            <ProtectedRoute>
              <ProfessionSelectionLanding />
            </ProtectedRoute>
          } />
          <Route path="/service-profile-collection" element={
            <ProtectedRoute>
              <ServiceProfileCollection />
            </ProtectedRoute>
          } />
          <Route path="/risk-assessment-questionnaire" element={
            <ProtectedRoute>
              <RiskAssessmentQuestionnaire />
            </ProtectedRoute>
          } />
          <Route path="/dynamic-results-dashboard" element={
            <ProtectedRoute>
              <DynamicResultsDashboard />
            </ProtectedRoute>
          } />
          <Route path="/gap-calculator-tool" element={
            <ProtectedRoute>
              <GapCalculatorTool />
            </ProtectedRoute>
          } />
          <Route path="/report-delivery-confirmation" element={
            <ProtectedRoute>
              <ReportDeliveryConfirmation />
            </ProtectedRoute>
          } />

          {/* Static pages - public */}
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

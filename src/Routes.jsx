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
import { VersionProvider } from "contexts/VersionContext";

// Authentication pages
import Login from "pages/login";
import Register from "pages/register";
import PendingApproval from "pages/pending-approval";
import Dashboard from "pages/dashboard";
import UserProfile from "pages/user-profile";
import UserManagement from "pages/admin/user-management";
import ConfigurationDashboard from "pages/admin/configuration";
import ConfigurationTest from "pages/admin/configuration/test";
import ConfigurationVerification from "pages/admin/configuration/verification";
import ConfigurationIntegrationTest from "pages/admin/configuration/test-integration";

// Assessment pages
import EntryLanding from "pages/entry-landing";
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
      <VersionProvider>
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
          <Route path="/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/user-management" element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/configuration" element={
            <ProtectedRoute requireAdmin={true}>
              <ConfigurationDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/configuration/test" element={
            <ProtectedRoute requireAdmin={true}>
              <ConfigurationTest />
            </ProtectedRoute>
          } />
          <Route path="/admin/configuration/verification" element={
            <ProtectedRoute requireAdmin={true}>
              <ConfigurationVerification />
            </ProtectedRoute>
          } />
          <Route path="/admin/configuration/test-integration" element={
            <ProtectedRoute requireAdmin={true}>
              <ConfigurationIntegrationTest />
            </ProtectedRoute>
          } />

          {/* Entry landing page - new root route */}
          <Route path="/" element={<EntryLanding />} />

          {/* Public routes - no authentication required */}
          <Route path="/public/assessment" element={<ProfessionSelectionLanding />} />
          <Route path="/public/profile" element={<ServiceProfileCollection />} />
          <Route path="/public/questionnaire" element={<RiskAssessmentQuestionnaire />} />
          <Route path="/public/results" element={<DynamicResultsDashboard />} />
          <Route path="/public/calculator" element={<GapCalculatorTool />} />
          <Route path="/public/report" element={<ReportDeliveryConfirmation />} />
          {/* Agent routes - require authentication and approval */}
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
      </VersionProvider>
    </BrowserRouter>
  );
};

export default Routes;

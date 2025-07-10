import React from "react";
import Routes from "./Routes";
import { ToastProvider } from "components/ui/ToastProvider";
import { AssessmentProvider } from "contexts/AssessmentContext";
import { AuthProvider } from "contexts/AuthContext";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AssessmentProvider>
          <Routes />
        </AssessmentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

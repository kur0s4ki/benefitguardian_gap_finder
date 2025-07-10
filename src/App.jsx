import React from "react";
import Routes from "./Routes";
import { ToastProvider } from "components/ui/ToastProvider";
import { AssessmentProvider } from "contexts/AssessmentContext";

function App() {
  return (
    <ToastProvider>
      <AssessmentProvider>
        <Routes />
      </AssessmentProvider>
    </ToastProvider>
  );
}

export default App;

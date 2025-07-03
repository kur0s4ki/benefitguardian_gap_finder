import React from "react";
import Routes from "./Routes";
import { ToastProvider } from "components/ui/ToastProvider";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

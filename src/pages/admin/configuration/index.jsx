import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { configService } from "../../../services/configurationService";
import Icon from "../../../components/AppIcon";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useToast } from "../../../components/ui/ToastProvider";
import StaticPageHeader from "../../../components/ui/StaticPageHeader";
import RiskScoringConfig from "./components/RiskScoringConfig";
import CalculationsConfig from "./components/CalculationsConfig";
import ProfessionsConfig from "./components/ProfessionsConfig";
import StatesConfig from "./components/StatesConfig";
import InvestmentsConfig from "./components/InvestmentsConfig";

const ConfigurationDashboard = () => {
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("risk-scoring");
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    if (!isAdmin()) return;
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      const configuration = await configService.getConfiguration();
      setConfig(configuration);
    } catch (error) {
      console.error("Failed to load configuration:", error);
      addToast("Failed to load configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "risk-scoring", name: "Risk Scoring", icon: "Target" },
    { id: "calculations", name: "Calculations", icon: "Calculator" },
    { id: "professions", name: "Professions", icon: "Users" },
    { id: "states", name: "States", icon: "Map" },
    { id: "investments", name: "Investments", icon: "TrendingUp" },
  ];

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="ShieldX" size={48} className="text-error mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Access Denied
          </h1>
          <p className="text-text-secondary">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-text-secondary mt-4">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StaticPageHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Icon name="Settings" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Calculation Configuration
              </h1>
              <p className="text-text-secondary">
                Manage all calculation parameters and system settings
              </p>
            </div>
          </div>

          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon
                name="AlertTriangle"
                size={20}
                className="text-warning-600 mt-0.5"
              />
              <div>
                <h3 className="font-medium text-warning-800 mb-1">
                  Important Notice
                </h3>
                <p className="text-sm text-warning-700">
                  Changes to these settings will affect all future calculations.
                  Please test thoroughly before making significant
                  modifications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-2 md:space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-3 md:px-2 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
                }`}
              >
                <Icon name={tab.icon} size={16} className="md:hidden" />
                <span className="hidden md:inline">{tab.name}</span>
                <span className="md:hidden">{tab.name.split(" ")[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "risk-scoring" && (
            <RiskScoringConfig config={config} onUpdate={loadConfiguration} />
          )}
          {activeTab === "calculations" && (
            <CalculationsConfig config={config} onUpdate={loadConfiguration} />
          )}
          {activeTab === "professions" && (
            <ProfessionsConfig config={config} onUpdate={loadConfiguration} />
          )}
          {activeTab === "states" && (
            <StatesConfig config={config} onUpdate={loadConfiguration} />
          )}
          {activeTab === "investments" && (
            <InvestmentsConfig config={config} onUpdate={loadConfiguration} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Configuration last updated: {new Date().toLocaleString()}
            </div>
            <button
              onClick={loadConfiguration}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary-50 transition-colors"
            >
              <Icon name="RefreshCw" size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationDashboard;

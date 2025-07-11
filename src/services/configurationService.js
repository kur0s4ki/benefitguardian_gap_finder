// Configuration Service - Fetches calculation parameters from Supabase with fallback
import { supabase } from '../lib/supabase';

class ConfigurationService {
  constructor() {
    this.cache = new Map();
    this.lastFetch = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.fallbackConfig = this.getFallbackConfig();
  }

  // Fallback to current hardcoded values
  getFallbackConfig() {
    return {
      DEFAULT_PENSION_VALUES: {
        teacher: 3200,
        nurse: 2800,
        "first-responder": 4100,
        "state-local-hero": 3500,
      },
      PROFESSION_FACTORS: {
        teacher: 1.0,
        nurse: 1.15,
        "first-responder": 1.25,
        "state-local-hero": 1.05,
      },
      STATE_FACTORS: {
        CA: 1.2, NY: 1.2, TX: 1.2, FL: 1.1, PA: 1.1, IL: 1.1, WA: 1.1, MA: 1.1,
        NJ: 1.1, VA: 1.1, NC: 1.0, GA: 1.0, OH: 1.0, MI: 1.0, AZ: 1.0, TN: 1.0,
        IN: 1.0, MO: 1.0, MD: 1.1, WI: 1.0, CO: 1.1, MN: 1.0, SC: 1.0, AL: 1.0,
        LA: 1.0, KY: 1.0, OR: 1.1, OK: 1.0, CT: 1.1, UT: 1.0, IA: 1.0, NV: 1.0,
        AR: 1.0, MS: 1.0, KS: 1.0, NM: 1.0, NE: 1.0, WV: 1.0, ID: 1.0, HI: 1.2,
        NH: 1.0, ME: 1.0, MT: 1.0, RI: 1.0, DE: 1.0, SD: 1.0, ND: 1.0, AK: 1.2,
        VT: 1.0, WY: 1.0,
      },
      COVERAGE_LEVELS: { yes: 0.3, no: 1.0, true: 0.3, false: 1.0 },
      COLA_VALUES: { yes: 1, no: 0, unsure: 0, true: 1, false: 0 },
      YEARS_UNTIL_RETIREMENT_CONVERSION: {
        "5-10": 8, "11-15": 13, "16-20": 18, "21-25": 23, "26+": 28,
      },
      RISK_WEIGHTS: { pension: 0.5, tax: 0.3, survivor: 0.2 },
      RISK_THRESHOLDS: { low: 39, moderate: 69 },
      GAP_RATES: { pension: 0.03, tax: 0.3, survivor: 0.4 },
      RISK_BONUSES: { early_retirement: 20, tax_surprises: 30 },
      CALCULATION_CONSTANTS: {
        hidden_benefit_base: 1800,
        max_service_years: 28,
        lifetime_multiplier: 3.0,
        monthly_to_20year: 240,
      },
      INVESTMENT_GROWTH_RATES: {
        conservative: 0.05,
        moderate: 0.07,
        aggressive: 0.09,
      },
      COMPONENT_THRESHOLDS: {
        low: 30,
        medium: 60,
      },
      PRESET_SCENARIOS: [
        {
          id: "conservative",
          name: "Conservative",
          monthlyContribution: 650,
          targetRetirementAge: 67,
          riskTolerance: "conservative",
          description: "Lower risk, steady growth approach",
        },
        {
          id: "moderate",
          name: "Moderate",
          monthlyContribution: 600,
          targetRetirementAge: 65,
          riskTolerance: "moderate",
          description: "Balanced risk and growth strategy",
        },
        {
          id: "aggressive",
          name: "Aggressive",
          monthlyContribution: 650,
          targetRetirementAge: 62,
          riskTolerance: "aggressive",
          description: "Higher risk, accelerated growth plan",
        },
      ],
    };
  }

  async getConfiguration() {
    // Check cache first
    if (this.cache.size > 0 && this.lastFetch &&
        Date.now() - this.lastFetch < this.cacheTimeout) {
      console.log('[ConfigService] Using cached configuration');
      return this.buildConfigFromCache();
    }

    try {
      console.log('[ConfigService] Fetching fresh configuration from database...');
      await this.fetchAllConfiguration();
      const config = this.buildConfigFromCache();
      console.log('[ConfigService] Successfully built configuration from database');
      return config;
    } catch (error) {
      console.error('[ConfigService] Failed to fetch configuration from database, using fallback:', error);
      return this.fallbackConfig;
    }
  }

  async fetchAllConfiguration() {
    console.log('[ConfigService] Fetching configuration from database tables...');

    const [
      { data: coreConfig, error: coreError },
      { data: professionConfig, error: professionError },
      { data: stateConfig, error: stateError },
      { data: investmentScenarios, error: investmentError },
      { data: financialFears, error: fearsError }
    ] = await Promise.all([
      supabase.from('calculation_config').select('*').eq('is_active', true),
      supabase.from('profession_config').select('*').eq('is_active', true),
      supabase.from('state_config').select('*').eq('is_active', true),
      supabase.from('investment_scenarios').select('*').eq('is_active', true).order('display_order'),
      supabase.from('financial_fears_config').select('*').eq('is_active', true).order('display_order')
    ]);

    console.log('[ConfigService] Database fetch results:', {
      coreConfig: coreConfig?.length || 0,
      professionConfig: professionConfig?.length || 0,
      stateConfig: stateConfig?.length || 0,
      investmentScenarios: investmentScenarios?.length || 0,
      financialFears: financialFears?.length || 0,
      errors: { coreError, professionError, stateError, investmentError, fearsError }
    });

    // Check for errors
    if (coreError) throw coreError;
    if (professionError) throw professionError;
    if (stateError) throw stateError;
    if (investmentError) throw investmentError;
    if (fearsError) throw fearsError;

    // Cache the results
    this.cache.set('core', coreConfig || []);
    this.cache.set('profession', professionConfig || []);
    this.cache.set('state', stateConfig || []);
    this.cache.set('investment', investmentScenarios || []);
    this.cache.set('fears', financialFears || []);
    this.lastFetch = Date.now();

    console.log('[ConfigService] Configuration cached successfully');
  }

  buildConfigFromCache() {
    const coreConfig = this.cache.get('core') || [];
    const professionConfig = this.cache.get('profession') || [];
    const stateConfig = this.cache.get('state') || [];
    const investmentScenarios = this.cache.get('investment') || [];

    // Start with fallback configuration
    const config = { ...this.fallbackConfig };

    // Process core configuration
    const configCategories = {};
    coreConfig.forEach(item => {
      const value = item.data_type === 'number' ? parseFloat(item.value) : 
                   item.data_type === 'boolean' ? item.value === 'true' :
                   item.data_type === 'object' ? JSON.parse(item.value) : item.value;
      
      if (!configCategories[item.category]) {
        configCategories[item.category] = {};
      }
      configCategories[item.category][item.key] = value;
    });

    // Map categories to config structure
    if (configCategories.risk_scoring) {
      config.RISK_WEIGHTS = {
        pension: configCategories.risk_scoring.pension_weight || 0.5,
        tax: configCategories.risk_scoring.tax_weight || 0.3,
        survivor: configCategories.risk_scoring.survivor_weight || 0.2,
      };
    }

    if (configCategories.risk_thresholds) {
      config.RISK_THRESHOLDS = {
        low: configCategories.risk_thresholds.low_risk_max || 39,
        moderate: configCategories.risk_thresholds.moderate_risk_max || 69,
      };
    }

    if (configCategories.gap_calculations) {
      config.GAP_RATES = {
        pension: configCategories.gap_calculations.pension_gap_rate || 0.03,
        tax: configCategories.gap_calculations.tax_torpedo_rate || 0.3,
        survivor: configCategories.gap_calculations.survivor_gap_rate || 0.4,
      };
    }

    if (configCategories.coverage_levels) {
      config.COVERAGE_LEVELS = {
        yes: configCategories.coverage_levels.has_coverage || 0.3,
        no: configCategories.coverage_levels.no_coverage || 1.0,
        true: configCategories.coverage_levels.has_coverage || 0.3,
        false: configCategories.coverage_levels.no_coverage || 1.0,
      };
    }

    if (configCategories.cola_values) {
      config.COLA_VALUES = {
        yes: configCategories.cola_values.has_cola || 1,
        no: configCategories.cola_values.no_cola || 0,
        unsure: configCategories.cola_values.no_cola || 0,
        true: configCategories.cola_values.has_cola || 1,
        false: configCategories.cola_values.no_cola || 0,
      };
    }

    if (configCategories.risk_bonuses) {
      config.RISK_BONUSES = {
        early_retirement: configCategories.risk_bonuses.early_retirement_bonus || 20,
        tax_surprises: configCategories.risk_bonuses.tax_surprises_bonus || 30,
      };
    }

    if (configCategories.calculation_constants) {
      config.CALCULATION_CONSTANTS = {
        hidden_benefit_base: configCategories.calculation_constants.hidden_benefit_base || 1800,
        max_service_years: configCategories.calculation_constants.max_service_years || 28,
        lifetime_multiplier: configCategories.calculation_constants.lifetime_multiplier || 3.0,
        monthly_to_20year: configCategories.calculation_constants.monthly_to_20year || 240,
      };
    }

    if (configCategories.retirement_conversion) {
      config.YEARS_UNTIL_RETIREMENT_CONVERSION = {
        "5-10": configCategories.retirement_conversion.years_5_10 || 8,
        "11-15": configCategories.retirement_conversion.years_11_15 || 13,
        "16-20": configCategories.retirement_conversion.years_16_20 || 18,
        "21-25": configCategories.retirement_conversion.years_21_25 || 23,
        "26+": configCategories.retirement_conversion.years_26_plus || 28,
      };
    }

    if (configCategories.component_thresholds) {
      config.COMPONENT_THRESHOLDS = {
        low: configCategories.component_thresholds.low_component_max || 30,
        medium: configCategories.component_thresholds.medium_component_max || 60,
      };
    }

    // Process profession configuration
    const defaultPensions = {};
    const professionFactors = {};
    professionConfig.forEach(item => {
      if (item.config_type === 'default_pension') {
        defaultPensions[item.profession] = parseFloat(item.value);
      } else if (item.config_type === 'risk_factor') {
        professionFactors[item.profession] = parseFloat(item.value);
      }
    });
    if (Object.keys(defaultPensions).length > 0) {
      config.DEFAULT_PENSION_VALUES = defaultPensions;
    }
    if (Object.keys(professionFactors).length > 0) {
      config.PROFESSION_FACTORS = professionFactors;
    }

    // Process state configuration
    const stateFactors = {};
    stateConfig.forEach(item => {
      stateFactors[item.state_code] = parseFloat(item.cost_of_living_factor);
    });
    if (Object.keys(stateFactors).length > 0) {
      config.STATE_FACTORS = stateFactors;
    }

    // Process investment scenarios
    if (investmentScenarios.length > 0) {
      const growthRates = {};
      const presetScenarios = investmentScenarios.map(scenario => ({
        id: scenario.scenario_id,
        name: scenario.name,
        monthlyContribution: scenario.monthly_contribution,
        targetRetirementAge: scenario.target_retirement_age,
        riskTolerance: scenario.risk_tolerance,
        description: scenario.description,
      }));
      
      investmentScenarios.forEach(scenario => {
        growthRates[scenario.risk_tolerance] = parseFloat(scenario.annual_growth_rate);
      });
      
      config.INVESTMENT_GROWTH_RATES = growthRates;
      config.PRESET_SCENARIOS = presetScenarios;
    }

    return config;
  }

  async refreshCache() {
    this.cache.clear();
    this.lastFetch = null;
    return this.getConfiguration();
  }

  // Admin methods for updating configuration
  async updateCoreConfig(category, key, value, dataType, description, displayName) {
    // Process value based on data type for JSONB storage
    let processedValue = value;
    if (dataType === 'number' && typeof value === 'string') {
      processedValue = parseFloat(value);
    } else if (dataType === 'object') {
      processedValue = typeof value === 'string' ? JSON.parse(value) : value;
    } else if (dataType === 'boolean') {
      processedValue = typeof value === 'string' ? value === 'true' : Boolean(value);
    }
    // For string type, keep as is

    const { error } = await supabase
      .from('calculation_config')
      .upsert({
        category,
        key,
        value: processedValue,
        data_type: dataType,
        description,
        display_name: displayName,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'category,key'
      });

    if (error) throw error;
    await this.refreshCache();
  }

  async updateProfessionConfig(profession, configType, value, description) {
    // Convert value to appropriate type for JSONB storage
    let processedValue = value;
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      processedValue = parseFloat(value);
    }

    const { error } = await supabase
      .from('profession_config')
      .upsert({
        profession,
        config_type: configType,
        value: processedValue,
        description,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'profession,config_type'
      });

    if (error) throw error;
    await this.refreshCache();
  }

  async updateStateConfig(stateCode, stateName, factor, description) {
    const { error } = await supabase
      .from('state_config')
      .upsert({
        state_code: stateCode,
        state_name: stateName,
        cost_of_living_factor: factor,
        description,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'state_code'
      });

    if (error) throw error;
    await this.refreshCache();
  }

  async updateInvestmentScenario(scenarioId, name, monthlyContribution, targetRetirementAge, riskTolerance, annualGrowthRate, description, displayOrder) {
    const { error } = await supabase
      .from('investment_scenarios')
      .upsert({
        scenario_id: scenarioId,
        name,
        monthly_contribution: monthlyContribution,
        target_retirement_age: targetRetirementAge,
        risk_tolerance: riskTolerance,
        annual_growth_rate: annualGrowthRate,
        description,
        display_order: displayOrder,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'scenario_id'
      });

    if (error) throw error;
    await this.refreshCache();
  }

  async getAllCoreConfig() {
    const { data, error } = await supabase
      .from('calculation_config')
      .select('*')
      .eq('is_active', true)
      .order('category, key');

    if (error) throw error;
    return data;
  }

  async getAllProfessionConfig() {
    const { data, error } = await supabase
      .from('profession_config')
      .select('*')
      .eq('is_active', true)
      .order('profession, config_type');

    if (error) throw error;
    return data;
  }

  async getAllStateConfig() {
    const { data, error } = await supabase
      .from('state_config')
      .select('*')
      .eq('is_active', true)
      .order('state_code');

    if (error) throw error;
    return data;
  }

  async getAllInvestmentScenarios() {
    const { data, error } = await supabase
      .from('investment_scenarios')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return data;
  }
}

export const configService = new ConfigurationService();

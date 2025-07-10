"use client"

import { useEffect, useState, useMemo } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { calculateComparisonResults, formatCurrency, formatPercentage, formatDate } from "@/lib/calculator-utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { pdf } from "@react-pdf/renderer"
import { CalculatorPDF } from "@/components/calculator-pdf"
import { DisclaimerModal } from "@/components/disclaimer-modal"
import React from "react"
import { saveAs } from "file-saver"

interface CalculatorProps {
  userName: string
  userId: string
}

// Define PDFButton props interface
interface PDFButtonProps {
  premium1: number;
  premium2: number;
  frequency1: 'monthly' | 'annual';
  frequency2: 'monthly' | 'annual';
  yearsOfFunding: number;
  currentAge: number;
  retirementAge: number;
  faceAmount: number;
  faceAmountB: number;
  inflationRate: number;
  agentName: string;
  clientName: string;
  results: any[];
  disabled: boolean;
}

// Replace PDFButton component with a simpler one that generates PDF on demand
const PDFButton = React.memo(({ 
  premium1,
  premium2, 
  frequency1, 
  frequency2, 
  yearsOfFunding,
  currentAge,
  retirementAge,
  faceAmount, 
  faceAmountB, 
  inflationRate, 
  agentName, 
  clientName, 
  results,
  disabled
}: PDFButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      
      // Create the PDF document on demand
      const document = (
        <CalculatorPDF
          premium1={premium1}
          premium2={premium2}
          frequency1={frequency1}
          frequency2={frequency2}
          yearsOfFunding={yearsOfFunding}
          currentAge={currentAge}
          retirementAge={retirementAge}
          faceAmount={faceAmount}
          faceAmountB={faceAmountB}
          inflationRate={inflationRate}
          agentName={agentName}
          clientName={clientName}
          results={results}
        />
      );
      
      // Generate PDF blob
      const blob = await pdf(document).toBlob();
      
      // Save file using file-saver
      saveAs(blob, `${clientName || "Freedom2Retire"}-calculator-report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="bg-amber-600 hover:bg-amber-700 shadow-md flex items-center justify-center w-full sm:w-auto"
      disabled={loading || disabled}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {loading ? "Generating..." : "PDF"}
    </Button>
  );
});

export function Calculator({ userName, userId }: CalculatorProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"table" | "chart">("table")
  
  // Form state
  const [clientName, setClientName] = useState("")
  const [premiumA, setPremiumA] = useState(10000)
  const [premiumB, setPremiumB] = useState(15000)
  const [faceAmountA, setFaceAmountA] = useState(500000)
  const [faceAmountB, setFaceAmountB] = useState(750000)
  const [fundingPeriod, setFundingPeriod] = useState(20)
  const [currentAge, setCurrentAge] = useState(45)
  const [retirementAge, setRetirementAge] = useState(65)
  const [inflationRate, setInflationRate] = useState(2)
  const [frequencyA, setFrequencyA] = useState<'monthly' | 'annual'>('annual')
  const [frequencyB, setFrequencyB] = useState<'monthly' | 'annual'>('annual')
  
  // String versions of numeric inputs to handle empty fields
  const [premiumAInput, setPremiumAInput] = useState("10000")
  const [premiumBInput, setPremiumBInput] = useState("15000")
  const [faceAmountAInput, setFaceAmountAInput] = useState("500000")
  const [faceAmountBInput, setFaceAmountBInput] = useState("750000")
  const [currentAgeInput, setCurrentAgeInput] = useState("45")
  const [retirementAgeInput, setRetirementAgeInput] = useState("65")
  
  // Interactive state
  const [isFundingSliderActive, setIsFundingSliderActive] = useState(false)
  const [isInflationSliderActive, setIsInflationSliderActive] = useState(false)
  const [ageError, setAgeError] = useState("")
  
  // Results state
  const [calculationResults, setCalculationResults] = useState<any[]>([])
  
  // Update funding period when ages change
  useEffect(() => {
    if (retirementAge > currentAge) {
      setFundingPeriod(retirementAge - currentAge)
      setAgeError("")
    } else if (currentAge !== 0 && retirementAge !== 0) {
      setAgeError("Retirement age must be greater than current age")
    }
  }, [currentAge, retirementAge])
  
  // Calculate results in real-time when inputs change
  useEffect(() => {
    // Calculate the results
    const results = calculateComparisonResults(
      premiumA, 
      premiumB,
      fundingPeriod,
      inflationRate,
      frequencyA,
      frequencyB
    )
    
    setCalculationResults(results)
  }, [premiumA, premiumB, fundingPeriod, inflationRate, frequencyA, frequencyB])
  
  const handleSave = async () => {
    // Check if validation passes before proceeding
    if (ageError) {
      toast({
        title: "Validation error",
        description: "Please fix the age inputs. Retirement age must be greater than current age.",
        variant: "destructive",
      })
      return;
    }
    
    setLoading(true)
    
    try {
      // Save calculation to database
      const { data: calculation, error: calculationError } = await supabase
        .from("calculations")
        .insert({
          user_id: userId,
          client_name: clientName,
          premium_a: premiumA,
          premium_b: premiumB,
          face_amount_a: faceAmountA,
          face_amount_b: faceAmountB,
          funding_period: fundingPeriod,
          current_age: currentAge,
          retirement_age: retirementAge,
          inflation_rate: inflationRate,
          agent_name: userName,
          frequency_a: frequencyA,
          frequency_b: frequencyB,
        })
        .select()
        .single()
      
      if (calculationError) throw calculationError
      
      // Save calculation results to database
      const calculationResultPromises = calculationResults.map(result => 
        supabase.from("calculation_results").insert({
          calculation_id: calculation.id,
          interest_rate: result.interestRate,
          future_value_a: result.futureValueA,
          inflation_adjusted_value_a: result.inflationAdjustedValueA,
          future_value_b: result.futureValueB,
          inflation_adjusted_value_b: result.inflationAdjustedValueB,
          income_a_45: result.incomeA45,
          income_a_51: result.incomeA51,
          income_b_45: result.incomeB45,
          income_b_51: result.incomeB51
        })
      )
      
      await Promise.all(calculationResultPromises)
      
      toast({
        title: "Calculation saved",
        description: "Your premium comparison has been saved to history.",
      })
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setClientName("")
    setPremiumA(10000)
    setPremiumB(15000)
    setFaceAmountA(500000)
    setFaceAmountB(750000)
    setFundingPeriod(20)
    setInflationRate(3)
    setFrequencyA('annual')
    setFrequencyB('annual')
    setPremiumAInput("10000")
    setPremiumBInput("15000")
    setFaceAmountAInput("500000")
    setFaceAmountBInput("750000")
    
    toast({
      title: "Form reset",
      description: "The calculator has been reset to default values.",
    })
  }
  
  const handleExportPdf = async () => {
    try {
      const element = document.createElement("a");
      element.href = "#";
      element.setAttribute("download", `${clientName || "Freedom2Retire"}-calculator-report.pdf`);
      element.style.display = "none";
      document.body.appendChild(element);
      
      // Create a container for the PDF download link
      const container = document.createElement("div");
      container.id = "pdf-download-container";
      container.style.display = "none";
      document.body.appendChild(container);
      
      // Render the PDF download link
      const pdfLink = document.getElementById("pdf-download-container");
      if (pdfLink) {
        // Trigger the PDF download
        element.click();
        
        toast({
          title: "PDF Generated",
          description: "Your premium comparison report is being downloaded.",
        });
      }
      
      // Clean up
      document.body.removeChild(element);
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }
  
  const handleEmailResults = async () => {
    try {
      toast({
        title: "Email feature",
        description: "Email feature will be implemented soon.",
      })
    } catch (error: any) {
      toast({
        title: "Email failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }
  
  // Function to format Y-axis labels
  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value}`
  }
  
  // Handle numeric input changes with string state
  const handlePremiumAChange = (value: string) => {
    setPremiumAInput(value);
    if (value === '') {
      setPremiumA(0);
    } else {
      setPremiumA(Math.max(0, Number(value)));
    }
  };
  
  const handlePremiumBChange = (value: string) => {
    setPremiumBInput(value);
    if (value === '') {
      setPremiumB(0);
    } else {
      setPremiumB(Math.max(0, Number(value)));
    }
  };
  
  const handleFaceAmountAChange = (value: string) => {
    setFaceAmountAInput(value);
    if (value === '') {
      setFaceAmountA(0);
    } else {
      setFaceAmountA(Math.max(0, Number(value)));
    }
  };
  
  const handleFaceAmountBChange = (value: string) => {
    setFaceAmountBInput(value);
    if (value === '') {
      setFaceAmountB(0);
    } else {
      setFaceAmountB(Math.max(0, Number(value)));
    }
  };
  
  // Prepare chart data
  const chartData = calculationResults.map(result => ({
    name: `${result.interestRate}%`,
    "Future Value A": result.futureValueA,
    "Inflation-Adjusted A": result.inflationAdjustedValueA,
    "Future Value B": result.futureValueB,
    "Inflation-Adjusted B": result.inflationAdjustedValueB,
  }))
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg border-0">
        
        
        <CardContent className="space-y-6 pt-6 px-4 sm:px-6 bg-white bg-opacity-100">
          {/* Client Information */}
          <div className="space-y-4 rounded-lg bg-gradient-to-r from-green-50 to-white p-6 border border-green-100 shadow-sm">
            <h3 className="text-lg font-medium text-green-800 border-b border-green-200 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Client Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-green-800">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="John Doe"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-green-800">Date</Label>
                <Input id="date" value={formatDate(new Date())} disabled className="bg-green-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advisorName" className="text-green-800">Advisor</Label>
                <Input id="advisorName" value={userName} disabled className="bg-green-50" />
              </div>
            </div>
          </div>
          
          {/* Common Parameters */}
          <div className="space-y-4 rounded-lg bg-gradient-to-r from-amber-50 to-white p-6 border border-amber-100 shadow-sm">
            <h3 className="text-lg font-medium text-amber-800 border-b border-amber-200 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Parameters
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4 bg-white rounded-lg p-4 border border-green-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAge" className="text-green-800">Current Age</Label>
                    <div className="relative">
                      <Input
                        id="currentAge"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        value={currentAgeInput}
                        onChange={(e) => {
                          // Only allow digits
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setCurrentAgeInput(val);
                          if (val === '') {
                            setCurrentAge(0);
                          } else {
                            setCurrentAge(Math.max(0, Math.min(120, Number(val))));
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge" className="text-amber-800">Retirement Age</Label>
                    <div className="relative">
                      <Input
                        id="retirementAge"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        value={retirementAgeInput}
                        onChange={(e) => {
                          // Only allow digits
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setRetirementAgeInput(val);
                          if (val === '') {
                            setRetirementAge(0);
                          } else {
                            setRetirementAge(Math.max(0, Math.min(120, Number(val))));
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {ageError && (
                  <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {ageError}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 text-sm">
                  <div className="font-medium text-green-800">Funding Period:</div>
                  <div className="font-bold text-amber-600">{fundingPeriod} years</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Comparison Inputs */}
          <div className="space-y-4 rounded-lg bg-gradient-to-r from-green-50 to-white p-6 border border-green-100 shadow-sm">
            <h3 className="text-lg font-medium text-green-800 border-b border-green-200 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Premium Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Premium Option A */}
              <Card className="shadow-md border-green-200 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg p-4 sm:p-6">
                  <CardTitle className="text-white text-base sm:text-lg">Premium Option A</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 p-4 sm:p-6 bg-white">
                  <div className="space-y-2">
                    <Label htmlFor="premiumA" className="text-green-700">Premium Amount</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">$</span>
                      <Input
                        id="premiumA"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="pl-7 border-green-200 focus:border-green-500 focus:ring-green-500"
                        value={premiumAInput}
                        onChange={(e) => {
                          // Only allow digits
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          handlePremiumAChange(val);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequencyA" className="text-green-700">Payment Frequency</Label>
                    <Select value={frequencyA} onValueChange={(value) => setFrequencyA(value as 'monthly' | 'annual')}>
                      <SelectTrigger className="w-full border-green-200 focus:border-green-500 focus:ring-green-500 bg-white">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faceAmountA" className="text-green-700">Face Amount</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">$</span>
                      <Input
                        id="faceAmountA"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="pl-7 border-green-200 focus:border-green-500 focus:ring-green-500"
                        value={faceAmountAInput}
                        onChange={(e) => {
                          // Only allow digits
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          handleFaceAmountAChange(val);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Premium Option B */}
              <Card className="shadow-md border-amber-200 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-lg p-4 sm:p-6">
                  <CardTitle className="text-white text-base sm:text-lg">Premium Option B</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 p-4 sm:p-6 bg-white">
                  <div className="space-y-2">
                    <Label htmlFor="premiumB" className="text-amber-700">Premium Amount</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">$</span>
                      <Input
                        id="premiumB"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="pl-7 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        value={premiumBInput}
                        onChange={(e) => {
                          // Only allow digits
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          handlePremiumBChange(val);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequencyB" className="text-amber-700">Payment Frequency</Label>
                    <Select value={frequencyB} onValueChange={(value) => setFrequencyB(value as 'monthly' | 'annual')}>
                      <SelectTrigger className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-white">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faceAmountB" className="text-amber-700">Face Amount</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">$</span>
                      <Input
                        id="faceAmountB"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="pl-7 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        value={faceAmountBInput}
                        onChange={(e) => {
                          // Only allow digits
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          handleFaceAmountBChange(val);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:inline-flex sm:flex-wrap gap-3 pt-4 bg-green-50 p-4 rounded-lg border border-green-100">
            <Button 
              className="bg-green-700 hover:bg-green-800 shadow-md flex items-center justify-center w-full sm:w-auto"
              onClick={handleSave}
              disabled={loading || !!ageError}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save
                </>
              )}
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 shadow-md flex items-center justify-center w-full sm:w-auto"
              onClick={handleReset}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </Button>
            
            <PDFButton
              premium1={premiumA}
              premium2={premiumB}
              frequency1={frequencyA}
              frequency2={frequencyB}
              yearsOfFunding={fundingPeriod}
              currentAge={currentAge}
              retirementAge={retirementAge}
              faceAmount={faceAmountA}
              faceAmountB={faceAmountB}
              inflationRate={inflationRate}
              agentName={userName}
              clientName={clientName}
              results={calculationResults}
              disabled={!!ageError}
            />
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 shadow-md flex items-center justify-center w-full sm:w-auto"
              onClick={handleEmailResults}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Results Section */}
      {calculationResults.length > 0 && (
        <Card className="border-t-4 border-t-amber-500 shadow-lg overflow-hidden">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
            <CardTitle className="text-amber-800 text-lg sm:text-xl">Projected Future Tax-Free Value</CardTitle>
            <CardDescription className="text-green-700">
              Projected values at different interest rates
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 py-4 bg-white">
            <Tabs defaultValue="table" value={activeTab} onValueChange={(value) => setActiveTab(value as "table" | "chart")}>
              <TabsList className="grid w-full grid-cols-2 bg-amber-50 p-1 rounded-lg">
                <TabsTrigger 
                  value="table" 
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-md transition-all"
                >
                  Table View
                </TabsTrigger>
                <TabsTrigger 
                  value="chart" 
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-md transition-all"
                >
                  Chart View
                </TabsTrigger>
              </TabsList>
              
              {/* Table View */}
              <TabsContent value="table">
                <div className="rounded-md border overflow-auto mt-4 shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th rowSpan={1} className="border p-2 text-left">Interest Rate</th>
                        <th className="border p-2 text-center bg-green-50 text-green-800">
                          Premium A: {formatCurrency(premiumA)} ({frequencyA})
                        </th>
                        <th className="border p-2 text-center bg-amber-50 text-amber-800">
                          Premium B: {formatCurrency(premiumB)} ({frequencyB})
                        </th>
                      </tr>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left"></th>
                        <th className="border p-2 text-center bg-green-50 text-green-700">POTENTIAL TAX-FREE VALUE</th>
                        <th className="border p-2 text-center bg-amber-50 text-amber-700">POTENTIAL TAX-FREE VALUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResults.map((result, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}>
                          <td className="border p-2">{formatPercentage(result.interestRate)}</td>
                          <td className="border p-2 text-right">{formatCurrency(result.inflationAdjustedValueA)}</td>
                          <td className="border p-2 text-right">{formatCurrency(result.inflationAdjustedValueB)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              {/* Chart View */}
              <TabsContent value="chart">
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={calculationResults.map(result => ({
                        name: `${result.interestRate}%`,
                        "A": result.inflationAdjustedValueA,
                        "B": result.inflationAdjustedValueB
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatYAxisTick} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="A" name={`Premium A: ${formatCurrency(premiumA)}`} fill="#16a34a" />
                      <Bar dataKey="B" name={`Premium B: ${formatCurrency(premiumB)}`} fill="#d97706" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Retirement Income Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Monthly Tax-Free Retirement Income</h3>
                <DisclaimerModal />
              </div>
              <div className="rounded-md border overflow-auto shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th rowSpan={2} className="border p-2 text-left">Interest Rate</th>
                      <th colSpan={2} className="border p-2 text-center bg-green-50 text-green-800">
                        Premium A: {formatCurrency(premiumA)} ({frequencyA})
                      </th>
                      <th colSpan={2} className="border p-2 text-center bg-amber-50 text-amber-800">
                        Premium B: {formatCurrency(premiumB)} ({frequencyB})
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-center bg-green-50 text-green-700">Income @4.5%</th>
                      <th className="border p-2 text-center bg-green-50 text-green-700">Income @5.1%</th>
                      <th className="border p-2 text-center bg-amber-50 text-amber-700">Income @4.5%</th>
                      <th className="border p-2 text-center bg-amber-50 text-amber-700">Income @5.1%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationResults.map((result, index) => (
                      <tr key={`income-${index}`} className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}>
                        <td className="border p-2">{formatPercentage(result.interestRate)}</td>
                        <td className="border p-2 text-right">{formatCurrency(result.incomeA45)}/mo</td>
                        <td className="border p-2 text-right">{formatCurrency(result.incomeA51)}/mo</td>
                        <td className="border p-2 text-right">{formatCurrency(result.incomeB45)}/mo</td>
                        <td className="border p-2 text-right">{formatCurrency(result.incomeB51)}/mo</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Disclaimer Footer */}
      <div className="mt-6 mb-4">
        <DisclaimerModal variant="footer" className="py-2" />
      </div>
    </div>
  )
}

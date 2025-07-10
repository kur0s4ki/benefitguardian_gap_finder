"use client"

import { useState, useEffect, useMemo } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { pdf } from "@react-pdf/renderer"
import { CalculatorPDF } from "@/components/calculator-pdf"
import { formatDate } from "@/lib/utils"
import { calculateFutureValue, applyInflationAdjustment } from "@/lib/calculator-utils"
import { AlertCircle, ChevronLeft, ChevronRight, Download, Filter, Search, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from "react"
import { saveAs } from "file-saver"

interface Calculation {
  id: string
  user_id: string
  client_name: string
  premium_a: number
  premium_b: number
  face_amount_a: number
  face_amount_b: number
  funding_period: number
  inflation_rate: number
  agent_name: string
  frequency_a?: string
  frequency_b?: string
  created_at: string
}

interface Result {
  interestRate: number;
  futureValueA: number;
  inflationAdjustedValueA: number;
  futureValueB: number;
  inflationAdjustedValueB: number;
  premium1Value: number; // For PDF compatibility
  premium2Value: number; // For PDF compatibility
  incomeA45?: number;
  incomeA51?: number;
  incomeB45?: number;
  incomeB51?: number;
}

interface CalculationHistoryProps {
  calculations: Calculation[]
  isAdmin: boolean
}

// Define PDFHistoryButton props interface
interface PDFHistoryButtonProps {
  premium1: number;
  premium2: number;
  frequency1: string;
  frequency2: string;
  yearsOfFunding: number;
  faceAmount: number;
  faceAmountB: number;
  inflationRate: number;
  agentName: string;
  clientName: string;
  results: any[];
  fileName: string;
}

// Create a separate PDF button component to prevent unnecessary re-renders
const PDFHistoryButton = React.memo(({ 
  premium1,
  premium2, 
  frequency1, 
  frequency2, 
  yearsOfFunding, 
  faceAmount, 
  faceAmountB, 
  inflationRate, 
  agentName,
  clientName,
  results,
  fileName
}: PDFHistoryButtonProps) => {
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
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={loading}
      onClick={handleClick}
      className="border-blue-200 text-blue-700 hover:bg-blue-50"
    >
      <span className="flex items-center">
        <Download className="h-4 w-4 mr-1" /> {loading ? "Generating..." : "PDF"}
      </span>
    </Button>
  );
});

export function CalculationHistory({ calculations, isAdmin }: CalculationHistoryProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [clientFilter, setClientFilter] = useState("all")
  const [agentFilter, setAgentFilter] = useState("all")
  
  // Popover state
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  
  // Unique values for filters
  const [uniqueClients, setUniqueClients] = useState<string[]>([])
  const [uniqueAgents, setUniqueAgents] = useState<string[]>([])
  
  // Filtered calculations
  const [filteredCalculations, setFilteredCalculations] = useState<Calculation[]>(calculations)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [totalPages, setTotalPages] = useState(Math.ceil(calculations.length / itemsPerPage))
  
  // Initialize filter options
  useEffect(() => {
    // Extract unique clients
    const clients = calculations
      .map(calc => calc.client_name)
      .filter((client, index, self) => 
        client && self.indexOf(client) === index
      ) as string[];
    
    // Extract unique agents
    const agents = calculations
      .map(calc => calc.agent_name)
      .filter((agent, index, self) => 
        agent && self.indexOf(agent) === index
      ) as string[];
    
    setUniqueClients(clients);
    setUniqueAgents(agents);
  }, [calculations]);
  
  // Apply filters
  useEffect(() => {
    let results = [...calculations];
    
    // Apply search filter (searches client name and agent name)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(calc => 
        (calc.client_name?.toLowerCase().includes(search) || 
         calc.agent_name?.toLowerCase().includes(search))
      );
    }
    
    // Apply client filter
    if (clientFilter && clientFilter !== "all") {
      results = results.filter(calc => calc.client_name === clientFilter);
    }
    
    // Apply agent filter
    if (agentFilter && agentFilter !== "all") {
      results = results.filter(calc => calc.agent_name === agentFilter);
    }
    
    setFilteredCalculations(results);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [calculations, searchTerm, clientFilter, agentFilter]);
  
  // Get current calculations for the selected page
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCalculations = filteredCalculations.slice(indexOfFirstItem, indexOfLastItem)
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setClientFilter("all");
    setAgentFilter("all");
  }
  
  // Handle filter apply
  const handleApplyFilters = () => {
    // Close the popover
    setIsPopoverOpen(false);
  }
  
  // Handle pagination
  const goToNextPage = () => {
    setCurrentPage(page => Math.min(page + 1, totalPages))
  }
  
  const goToPreviousPage = () => {
    setCurrentPage(page => Math.max(page - 1, 1))
  }
  
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Delete calculation
  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const { error } = await supabase.from("calculations").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Calculation deleted",
        description: "The calculation has been deleted successfully.",
      })

      // Refresh the page to update the list
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error deleting calculation",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  if (calculations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No calculations found</h3>
        <p className="text-gray-500 mt-2">No premium calculations have been saved yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Premium Calculations</h3>
          <p className="text-sm text-gray-500">
            Total calculations: {filteredCalculations.length} 
            {filteredCalculations.length !== calculations.length && 
              ` (filtered from ${calculations.length})`
            }
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by client or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-10"
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 h-full px-2 text-gray-400"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {(clientFilter !== "all" || agentFilter !== "all") && 
                  <Badge className="ml-2 bg-green-100 text-green-800 border-0">Active</Badge>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Calculations</h4>
                
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {uniqueClients.map(client => (
                        <SelectItem key={client} value={client}>{client}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Agent</Label>
                  <Select value={agentFilter} onValueChange={setAgentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Agents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      {uniqueAgents.map(agent => (
                        <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleApplyFilters}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Table/Card View - Desktop shows table, Mobile shows cards */}
      <div>
        {/* Hidden on mobile, visible on tablets and up */}
        <div className="hidden sm:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Premium Options</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Terms</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCalculations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <h4 className="font-medium text-gray-700 mb-1">No results found</h4>
                      <p className="text-sm">Try adjusting your filters or search terms</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={resetFilters}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentCalculations.map((calc) => {
                  // Calculate results for PDF
                  const interestRates = [3.5, 6.45, 8.14, 10.17]
                  const results = interestRates.map((rate) => {
                    const frequencyA = calc.frequency_a as 'monthly' | 'annual' || 'annual';
                    const frequencyB = calc.frequency_b as 'monthly' | 'annual' || 'annual';
                    
                    const futureValueA = calculateFutureValue(calc.premium_a, rate, calc.funding_period, frequencyA);
                    const futureValueB = calculateFutureValue(calc.premium_b, rate, calc.funding_period, frequencyB);
                    
                    const inflationAdjustedValueA = applyInflationAdjustment(futureValueA, calc.inflation_rate, calc.funding_period);
                    const inflationAdjustedValueB = applyInflationAdjustment(futureValueB, calc.inflation_rate, calc.funding_period);
                    
                    // Calculate retirement income
                    const incomeA45 = Math.round((inflationAdjustedValueA * (4.5 / 100)) / 12);
                    const incomeA51 = Math.round((inflationAdjustedValueA * (5.1 / 100)) / 12);
                    const incomeB45 = Math.round((inflationAdjustedValueB * (4.5 / 100)) / 12);
                    const incomeB51 = Math.round((inflationAdjustedValueB * (5.1 / 100)) / 12);
                    
                    return {
                      interestRate: rate,
                      futureValueA,
                      inflationAdjustedValueA,
                      futureValueB,
                      inflationAdjustedValueB,
                      premium1Value: futureValueA,
                      premium2Value: futureValueB,
                      incomeA45,
                      incomeA51,
                      incomeB45,
                      incomeB51
                    };
                  });

                  return (
                    <tr key={calc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(calc.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {calc.client_name || "Unnamed Client"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calc.agent_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-green-700">${calc.premium_a}</span>
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                              {calc.frequency_a || "annual"}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium text-amber-700">${calc.premium_b}</span>
                            <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                              {calc.frequency_b || "annual"}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium">Period:</span> {calc.funding_period} years
                          </div>
                          <div>
                            <span className="font-medium">Inflation:</span> {calc.inflation_rate}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <PDFHistoryButton
                            premium1={calc.premium_a}
                            premium2={calc.premium_b}
                            frequency1={calc.frequency_a || 'annual'}
                            frequency2={calc.frequency_b || 'annual'}
                            yearsOfFunding={calc.funding_period}
                            faceAmount={calc.face_amount_a}
                            faceAmountB={calc.face_amount_b}
                            inflationRate={calc.inflation_rate}
                            agentName={calc.agent_name}
                            clientName={calc.client_name || "Client"}
                            results={results}
                            fileName={`premium-calculation-${formatDate(calc.created_at)}.pdf`}
                          />
                          
                          {isAdmin && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(calc.id)}
                              disabled={deleting === calc.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleting === calc.id ? 
                                "Deleting..." : 
                                <span className="flex items-center"><Trash2 className="h-4 w-4 mr-1" /> Delete</span>
                              }
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Visible on mobile, hidden on tablets and up - Card View */}
        <div className="sm:hidden space-y-4">
          {currentCalculations.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                <h4 className="font-medium text-gray-700 mb-1">No results found</h4>
                <p className="text-sm">Try adjusting your filters or search terms</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          ) : (
            currentCalculations.map((calc) => {
              // Calculate results for PDF
              const interestRates = [3.5, 6.45, 8.14, 10.17]
              const results = interestRates.map((rate) => {
                const frequencyA = calc.frequency_a as 'monthly' | 'annual' || 'annual';
                const frequencyB = calc.frequency_b as 'monthly' | 'annual' || 'annual';
                
                const futureValueA = calculateFutureValue(calc.premium_a, rate, calc.funding_period, frequencyA);
                const futureValueB = calculateFutureValue(calc.premium_b, rate, calc.funding_period, frequencyB);
                
                const inflationAdjustedValueA = applyInflationAdjustment(futureValueA, calc.inflation_rate, calc.funding_period);
                const inflationAdjustedValueB = applyInflationAdjustment(futureValueB, calc.inflation_rate, calc.funding_period);
                
                // Calculate retirement income
                const incomeA45 = Math.round((inflationAdjustedValueA * (4.5 / 100)) / 12);
                const incomeA51 = Math.round((inflationAdjustedValueA * (5.1 / 100)) / 12);
                const incomeB45 = Math.round((inflationAdjustedValueB * (4.5 / 100)) / 12);
                const incomeB51 = Math.round((inflationAdjustedValueB * (5.1 / 100)) / 12);
                
                return {
                  interestRate: rate,
                  futureValueA,
                  inflationAdjustedValueA,
                  futureValueB,
                  inflationAdjustedValueB,
                  premium1Value: futureValueA,
                  premium2Value: futureValueB,
                  incomeA45,
                  incomeA51,
                  incomeB45,
                  incomeB51
                };
              });

              return (
                <div key={calc.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{calc.client_name || "Unnamed Client"}</h3>
                      <p className="text-xs text-gray-500">{formatDate(calc.created_at)}</p>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border border-green-200">
                      {calc.agent_name}
                    </Badge>
                  </div>
                  
                  <div className="p-4 divide-y divide-gray-100">
                    <div className="py-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Premium A</p>
                        <div className="flex items-center mt-1">
                          <span className="text-sm font-medium text-green-700">${calc.premium_a}</span>
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 text-xs">
                            {calc.frequency_a || "annual"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Premium B</p>
                        <div className="flex items-center mt-1">
                          <span className="text-sm font-medium text-amber-700">${calc.premium_b}</span>
                          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                            {calc.frequency_b || "annual"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Funding Period</p>
                        <p className="text-sm font-medium">{calc.funding_period} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Inflation Rate</p>
                        <p className="text-sm font-medium">{calc.inflation_rate}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-gray-50 flex justify-between">
                      <PDFHistoryButton
                        premium1={calc.premium_a}
                        premium2={calc.premium_b}
                        frequency1={calc.frequency_a || 'annual'}
                        frequency2={calc.frequency_b || 'annual'}
                        yearsOfFunding={calc.funding_period}
                        faceAmount={calc.face_amount_a}
                        faceAmountB={calc.face_amount_b}
                        inflationRate={calc.inflation_rate}
                        agentName={calc.agent_name}
                        clientName={calc.client_name || "Client"}
                        results={results}
                        fileName={`premium-calculation-${formatDate(calc.created_at)}.pdf`}
                      />
                    
                      {isAdmin && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(calc.id)}
                          disabled={deleting === calc.id}
                        className="bg-red-600 hover:bg-red-700"
                        >
                        {deleting === calc.id ? 
                          "Deleting..." : 
                          <span className="flex items-center"><Trash2 className="h-4 w-4 mr-1" /> Delete</span>
                        }
                        </Button>
                      )}
                    </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      
      {/* Pagination controls */}
      {filteredCalculations.length > itemsPerPage && (
        <div className="flex items-center justify-between px-2 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredCalculations.length)}</span> of <span className="font-medium">{filteredCalculations.length}</span> results
              </p>
            </div>
            <div>
              <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNumber: number;
                  
                  // Determine which page numbers to show
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === pageNumber
                          ? "bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

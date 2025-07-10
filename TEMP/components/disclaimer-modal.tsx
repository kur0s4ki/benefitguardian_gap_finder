"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InfoIcon } from "lucide-react"

interface DisclaimerModalProps {
  variant?: "icon" | "button" | "link" | "footer"
  className?: string
}

export function DisclaimerModal({ variant = "button", className = "" }: DisclaimerModalProps) {
  const [open, setOpen] = useState(false)
  
  const openModal = useCallback(() => setOpen(true), [])
  
  // Export the openModal function for external use
  DisclaimerModal.openModal = openModal

  const trigger = {
    icon: (
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="About Retirement Income">
        <InfoIcon className="h-5 w-5 text-amber-600" />
      </Button>
    ),
    button: (
      <Button 
        variant="default" 
        size="default" 
        className={`bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-sm ${className}`}
      >
        <InfoIcon className="h-4 w-4 mr-2" />
        Disclaimer
      </Button>
    ),
    link: (
      <Button variant="link" className={`text-amber-600 underline p-0 h-auto hover:text-amber-800 ${className}`}>
        Disclaimer
      </Button>
    ),
    footer: (
      <div className={`text-center text-sm text-gray-500 ${className}`}>
        <span className="mr-1">This calculator provides estimates based on the information you provide.</span>
        <Button 
          variant="link" 
          className="p-0 h-auto text-amber-600 font-medium hover:text-amber-800"
          onClick={openModal}
        >
          View Disclaimer
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {variant !== 'footer' ? (
        <DialogTrigger asChild>
          {trigger[variant]}
        </DialogTrigger>
      ) : (
        trigger.footer
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-amber-700">Retirement Income Projection Calculator</DialogTitle>
          <DialogDescription className="text-base text-gray-700 mt-4">
            This calculator estimates your potential <span className="font-bold">monthly tax-free income</span> starting at desired age inputted, 
            funded exclusively through policy loans from your insurance carrier. While future inflation rates cannot be predicted, 
            all projections <span className="font-bold">automatically account for a 2% inflation factor</span> to provide more realistic, 
            long-term estimates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-2">
          <div>
            <h3 className="text-lg font-semibold text-amber-800">Withdrawal Rate Options:</h3>
            <ul className="mt-2 space-y-2 list-disc pl-6 text-gray-700">
              <li>
                <span className="font-bold">4.5% Withdrawal Rate</span>: Designed for long-term sustainability, 
                providing reliable income through age 100.
              </li>
              <li>
                <span className="font-bold">5.1% Withdrawal Rate</span>: Optimized for a <span className="font-bold">20-year income horizon</span>—this 
                higher withdrawal rate may not sustain payouts beyond <span className="font-bold">25 years</span>.
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-amber-800">Key Features:</h3>
            <ul className="mt-2 space-y-2 list-disc pl-6 text-gray-700">
              <li>
                <span className="font-bold">Tax-free retirement income</span> via policy loans (no taxable events)
              </li>
              <li>
                <span className="font-bold">Inflation-adjusted projections</span> (2% assumed for long-term planning)
              </li>
              <li>
                <span className="font-bold">Flexible withdrawal strategies</span> for short- or long-term needs
              </li>
              <li>
                <span className="font-bold">Growth potential persists</span> even after withdrawals begin
              </li>
            </ul>
          </div>
          
          <p className="text-gray-700 italic">
            This tool helps you evaluate how your policy can deliver <span className="font-bold">potential, tax-advantaged income</span> throughout retirement.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => setOpen(false)} 
            className="mt-4 bg-amber-600 hover:bg-amber-700"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Add a static method to the component
DisclaimerModal.openModal = () => {}; 
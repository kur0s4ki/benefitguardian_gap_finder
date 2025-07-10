import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-green-50 to-white">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <div className="h-24 w-24 relative mb-2">
              <Image 
                src="/logo.png" 
                alt="Freedom 2 Retire Logo" 
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-green-800 sm:text-5xl md:text-6xl">
            Freedom <span className="text-amber-500">2</span> Retire <span className="text-amber-500">Calculator</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A powerful calculator for financial professionals-retirement advisors to create premium projections with inflation
            adjustments and help clients plan for a secure retirement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-green-700 hover:bg-green-800 shadow-md px-8">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600 shadow-md px-8"
            >
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-green-50 py-12 border-t border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Premium Comparison</h3>
              <p className="text-gray-600">Compare different premium options with accurate future value projections.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-amber-600 text-xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Inflation Adjusted</h3>
              <p className="text-gray-600">Account for inflation with customizable rates to show real purchasing power.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Client-Friendly</h3>
              <p className="text-gray-600">Generate professional reports and visualizations to share with clients.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2023 Freedom 2 Retire Calculator. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/login" className="text-gray-500 hover:text-green-700 text-sm">Sign In</Link>
            <Link href="/register" className="text-gray-500 hover:text-green-700 text-sm">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

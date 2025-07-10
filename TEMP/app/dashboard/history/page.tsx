import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculationHistory } from "@/components/calculation-history"
import { Archive, Calculator, History as HistoryIcon } from "lucide-react"

export default async function History() {
  const supabase = createServerSupabaseClient()
  
  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile to check if admin
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user?.id).single()

  // If user is not approved, redirect
  if (!profile?.is_approved) {
    redirect("/pending-approval")
  }

  // Get calculations
  const { data: calculations } = await supabase
    .from("calculations")
    .select("*")
    .order("created_at", { ascending: false })
    
  // Calculate stats
  const totalCalculations = calculations?.length || 0
  const uniqueClients = new Set(calculations?.map(calc => calc.client_name)?.filter(Boolean)).size || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Calculation History</h1>
        <p className="text-gray-500">View and manage your previous premium calculations.</p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-50 rounded-full">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Calculations</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalCalculations}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-amber-50 rounded-full">
                <Archive className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Unique Clients</p>
                <h3 className="text-2xl font-bold text-gray-900">{uniqueClients}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-gray-50 rounded-t-lg border-b">
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-green-600" />
            Calculation Records
          </CardTitle>
          <CardDescription>Review and manage your saved premium calculations.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CalculationHistory calculations={calculations || []} isAdmin={profile?.is_admin || false} />
        </CardContent>
      </Card>
    </div>
  )
}

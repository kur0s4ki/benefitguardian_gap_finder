import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagement } from "@/components/user-management"
import { Users, Activity, Settings } from "lucide-react"

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile to check if admin
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user?.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  // Get all users
  const { data: users } = await supabase.from("user_profiles").select("*").order("created_at", { ascending: false })

  // Get some stats
  const totalUsers = users?.length || 0
  const pendingUsers = users?.filter(u => !u.is_approved).length || 0
  const activeUsers = users?.filter(u => u.is_approved).length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage system users and view activity.</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-50 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{activeUsers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-amber-50 rounded-full">
                <Settings className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                <h3 className="text-2xl font-bold text-gray-900">{pendingUsers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-gray-50 rounded-t-lg border-b">
          <CardTitle className="text-xl text-gray-900">User Management</CardTitle>
          <CardDescription>Approve or reject user registrations and manage existing users.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <UserManagement users={users || []} />
        </CardContent>
      </Card>
    </div>
  )
}

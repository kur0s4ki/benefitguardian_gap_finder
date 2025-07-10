import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Calculator } from "@/components/calculator"

export default async function Dashboard() {
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

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user?.id).single()
  
  // If user is not approved, redirect
  if (!profile?.is_approved) {
    redirect("/pending-approval")
  }

  return (
    <div className="space-y-6">
      <Calculator userName={profile?.full_name || ""} userId={user?.id || ""} />
    </div>
  )
}

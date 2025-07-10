import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  
  // Log debugging start
  //console.log("Dashboard layout - start auth check")
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // console.log("Auth session check result:", 
  //   session ? 
  //   `User authenticated: ${session.user.id}` : 
  //   "No session found, redirecting to login"
  // )

  if (!session) {
    redirect("/login")
  }

  // Get user profile to check if approved
  //console.log("Fetching user profile for ID:", session.user.id)
  
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()
  
  // console.log("User profile fetch result:", 
  //   profile ? 
  //   `Profile found - Approved: ${profile.is_approved}, Admin: ${profile.is_admin}` :
  //   "No profile found"
  // )
  
  if (error) {
    console.error("Error fetching profile:", error.message, error.details, error.hint)
  }

  if (!profile) {
    //console.log("REDIRECT REASON: Profile not found")
    redirect("/pending-approval")
  }

  if (!profile.is_approved) {
    //console.log("REDIRECT REASON: User not approved")
    redirect("/pending-approval")
  }

  //console.log("Auth check passed, rendering dashboard")

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar isAdmin={profile?.is_admin || false} />
        <main className="flex-1 p-4 md:p-6 bg-gray-50 w-full">{children}</main>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PendingApproval() {
  const { supabase, user, loading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    // console.log("Pending Approval Page - User data:", user ? `User ID: ${user.id}` : "No user data")
    // console.log("Loading state:", loading)
    
    if (!loading && !user) {
      //console.log("No authenticated user, redirecting to login")
      router.push("/login")
    } else if (!loading && user) {
      // Check profile to see why user was redirected here
      const checkProfileStatus = async () => {
        try {
          //console.log("Checking user profile status...")
          const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", user.id)
            .single()
            
          if (error) {
            console.error("Error fetching profile:", error.message)
          }
          
          // console.log("Profile data:", profile ? 
          //   `Found - Approved: ${profile.is_approved}, Admin: ${profile.is_admin}` : 
          //   "No profile found")
        } catch (err) {
          console.error("Error in profile check:", err)
        }
      }
      
      checkProfileStatus()
    }
  }, [user, loading, router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Account Pending Approval</CardTitle>
          <CardDescription className="text-center">Your account is waiting for administrator approval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            Thank you for registering. An administrator will review your account and approve it shortly. You will be
            able to access the calculator once your account is approved.
          </p>
          <p className="text-gray-600">Please check back later or contact your administrator for assistance.</p>
          <Button onClick={handleLogout} variant="outline" className="mt-4">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

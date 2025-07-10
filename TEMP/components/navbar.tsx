"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { LogOut, User, BarChart3, History, Settings } from "lucide-react"

export default function Navbar() {
  const { supabase, user } = useSupabase()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex h-16 items-center justify-between py-3">
        <div className="flex items-center gap-3 md:ml-0 ml-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Company Logo" 
                width={48} 
                height={48} 
                className="object-contain w-full h-full"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg sm:text-xl font-bold text-green-800">Freedom 2 Retire</span>
              <div className="h-0.5 w-16 sm:w-24 bg-amber-500 rounded mt-1"></div>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <Link href="/dashboard" className="px-3 py-2 text-green-700 hover:text-green-900 hover:bg-green-50 rounded-md flex items-center">
            <BarChart3 className="h-4 w-4 mr-1" />
            <span>Calculator</span>
          </Link>
          <Link href="/dashboard/history" className="px-3 py-2 text-green-700 hover:text-green-900 hover:bg-green-50 rounded-md flex items-center">
            <History className="h-4 w-4 mr-1" />
            <span>History</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-green-50 rounded-full px-3 py-1.5 text-green-700">
            <User className="h-4 w-4" />
            <span className="text-sm truncate max-w-[100px] md:max-w-[150px]">{user?.email}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-900"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

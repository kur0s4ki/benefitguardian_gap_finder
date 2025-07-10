"use client"

import { useState, useEffect } from "react" 
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calculator, History, Users, ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps {
  isAdmin: boolean
}

export default function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [open, setOpen] = useState(false)

  // Update isMobileView state based on window size
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    // Set initial value
    checkMobileView()
    
    // Add event listener
    window.addEventListener('resize', checkMobileView)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobileView)
    }
  }, [])

  const links = [
    {
      href: "/dashboard",
      label: "Calculator",
      icon: <Calculator className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/history",
      label: "History",
      icon: <History className="h-5 w-5" />,
      active: pathname === "/dashboard/history",
    },
  ]

  if (isAdmin) {
    links.push({
      href: "/dashboard/admin",
      label: "Admin",
      icon: <Users className="h-5 w-5" />,
      active: pathname === "/dashboard/admin",
    })
  }

  // Mobile sidebar drawer
  const MobileSidebar = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden fixed left-4 top-4 z-50"
          aria-label="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[250px] max-w-[80vw] border-r">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-semibold text-lg">Menu</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  link.active ? "bg-green-50 text-green-700 font-medium" : ""
                )}
                onClick={() => setOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  // Desktop sidebar
  const DesktopSidebar = () => (
    <aside className={cn(
      "hidden md:flex flex-col border-r bg-white transition-all duration-300 ease-in-out relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-4 translate-x-1/2 bg-white border shadow-sm rounded-full z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <div className="flex flex-col gap-2 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              link.active ? "bg-green-50 text-green-700 font-medium" : "",
              collapsed ? "justify-center" : ""
            )}
            title={collapsed ? link.label : undefined}
          >
            <div className={collapsed ? "h-6 w-6" : ""}>
              {link.icon}
            </div>
            {!collapsed && link.label}
          </Link>
        ))}
      </div>
    </aside>
  )

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  )
}

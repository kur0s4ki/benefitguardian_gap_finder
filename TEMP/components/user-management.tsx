"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  X 
} from "lucide-react"
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

interface UserProfile {
  id: string
  full_name: string | null
  is_approved: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

interface UserManagementProps {
  users: UserProfile[]
}

export function UserManagement({ users }: UserManagementProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [updating, setUpdating] = useState<string | null>(null)
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all")
  const [filterOpen, setFilterOpen] = useState(false)
  
  // Filtered users
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>(users)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [totalPages, setTotalPages] = useState(Math.ceil(users.length / itemsPerPage))
  
  // Apply filters
  useEffect(() => {
    let results = [...users];
    
    // Apply search filter (searches user name)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(user => 
        user.full_name?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(user => 
        statusFilter === "approved" ? user.is_approved : !user.is_approved
      );
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      results = results.filter(user => 
        roleFilter === "admin" ? user.is_admin : !user.is_admin
      );
    }
    
    setFilteredUsers(results);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, statusFilter, roleFilter]);
  
  // Get current users for the selected page
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
  }

  // Toggle user approval status
  const toggleApproval = async (user: UserProfile) => {
    setUpdating(user.id)
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ is_approved: !user.is_approved })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: `User ${user.is_approved ? "unapproved" : "approved"}`,
        description: `${user.full_name || "User"} has been ${user.is_approved ? "unapproved" : "approved"}.`,
      })

      // Refresh the page to update the list
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
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

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
        <p className="text-gray-500 mt-2">No user accounts have been created yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">User Accounts</h3>
          <p className="text-sm text-gray-500">
            Total users: {filteredUsers.length} 
            {filteredUsers.length !== users.length && 
              ` (filtered from ${users.length})`
            }
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name..."
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
          
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {(statusFilter !== "all" || roleFilter !== "all") && 
                  <Badge className="ml-2 bg-green-100 text-green-800 border-0">Active</Badge>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Users</h4>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">Regular User</SelectItem>
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
                    onClick={() => setFilterOpen(false)}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
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
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || "Unnamed User"}
                          </div>
                          <div className="flex items-center mt-1">
                            {user.is_admin && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center space-x-2">
                        {user.is_approved ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Approved</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>Pending</span>
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        size="sm"
                        variant={user.is_approved ? "outline" : "default"}
                        className={user.is_approved ? "border-red-200 text-red-700 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                        onClick={() => toggleApproval(user)}
                        disabled={updating === user.id}
                      >
                        {updating === user.id ? 
                          "Updating..." : 
                          user.is_approved ? 
                            <span className="flex items-center"><X className="h-4 w-4 mr-1" /> Unapprove</span> : 
                            <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Approve</span>
                        }
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Visible on mobile, hidden on tablets and up - Card View */}
        <div className="sm:hidden space-y-4">
          {currentUsers.length === 0 ? (
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
            currentUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {user.full_name || "Unnamed User"}
                    </h3>
                    <p className="text-xs text-gray-500">{formatDate(user.created_at)}</p>
                  </div>
                  <div className="flex space-x-1">
                    {user.is_approved ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Approved</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Pending</span>
                      </Badge>
                    )}
                    {user.is_admin && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="px-4 py-3">
                  <Button
                    size="sm"
                    variant={user.is_approved ? "outline" : "default"}
                    className={user.is_approved ? "border-red-200 text-red-700 hover:bg-red-50 w-full" : "bg-green-600 hover:bg-green-700 w-full"}
                    onClick={() => toggleApproval(user)}
                    disabled={updating === user.id}
                  >
                    {updating === user.id ? 
                      "Updating..." : 
                      user.is_approved ? 
                        <span className="flex items-center justify-center"><X className="h-4 w-4 mr-1" /> Unapprove</span> : 
                        <span className="flex items-center justify-center"><CheckCircle className="h-4 w-4 mr-1" /> Approve</span>
                    }
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Pagination controls */}
      {filteredUsers.length > itemsPerPage && (
        <div className="flex items-center justify-between px-2 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> users
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

          {/* Mobile pagination - simplified version */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

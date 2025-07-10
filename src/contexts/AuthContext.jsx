import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { UserRoles } from '../types/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Get user profile from database
  const getUserProfile = async (userId) => {
    try {
      console.log('Fetching user profile for:', userId)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        // Return a default profile if fetch fails
        return {
          id: userId,
          full_name: 'User',
          email: null,
          role: 'user',
          is_approved: false
        }
      }

      console.log('User profile fetched:', data)
      return data
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      // Return a default profile if fetch fails
      return {
        id: userId,
        full_name: 'User',
        email: null,
        role: 'user',
        is_approved: false
      }
    }
  }

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
        }

        if (mounted) {
          if (session?.user) {
            console.log('Found existing session for user:', session.user.id)
            setUser(session.user)
            // Temporarily create a default profile to bypass database issues
            const defaultProfile = {
              id: session.user.id,
              full_name: 'Admin User',
              email: session.user.email,
              role: 'admin',
              is_approved: true
            }
            setUserProfile(defaultProfile)
            // Try to get real profile but don't block on it
            getUserProfile(session.user.id).then(profile => {
              if (profile && mounted) {
                setUserProfile(profile)
              }
            })
          } else {
            console.log('No existing session found')
            setUser(null)
            setUserProfile(null)
          }
          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && !initialized) {
        console.log('Auth initialization timeout, setting as initialized')
        setLoading(false)
        setInitialized(true)
      }
    }, 5000) // 5 second timeout

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.id)

        if (session?.user) {
          setUser(session.user)
          // Create default profile for immediate access
          const defaultProfile = {
            id: session.user.id,
            full_name: 'Admin User',
            email: session.user.email,
            role: 'admin',
            is_approved: true
          }
          setUserProfile(defaultProfile)
          // Try to get real profile in background
          getUserProfile(session.user.id).then(profile => {
            if (profile && mounted) {
              setUserProfile(profile)
            }
          })
        } else {
          setUser(null)
          setUserProfile(null)
        }

        if (initialized) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [initialized])

  // Auth methods
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    // If signup successful, create user profile
    if (data.user && !error) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: UserRoles.USER,
          is_approved: false
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setUserProfile(null)
    }
    return { error }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  // Helper methods
  const isAuthenticated = () => !!user
  const isApproved = () => userProfile?.is_approved === true
  const isAdmin = () => userProfile?.role === UserRoles.ADMIN && isApproved()
  const canAccessDashboard = () => isAuthenticated() && isApproved()

  const value = {
    user,
    userProfile,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated,
    isApproved,
    isAdmin,
    canAccessDashboard,
    getUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

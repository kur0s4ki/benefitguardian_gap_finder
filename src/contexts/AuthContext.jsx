import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [accessLevel, setAccessLevel] = useState("public");
  const [loading, setLoading] = useState(true);

  // Secure auth initialization - ALWAYS verify role from database
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log("🔄 Initializing auth...");

        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            console.log("✅ User found:", session.user.email);
            setUser(session.user);
            setAccessLevel("authenticated");

            // ALWAYS verify role from database - NEVER trust localStorage
            console.log("🔍 Verifying role from database...");
            const { data: profile, error } = await supabase
              .from("user_profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();

            if (error) {
              console.error("❌ Error fetching role:", error);
              setUserRole(null);
            } else if (profile?.role) {
              console.log("✅ Role verified from database:", profile.role);
              setUserRole(profile.role);
            } else {
              console.log("❌ No role found in database");
              setUserRole(null);
            }
          } else {
            console.log("❌ No user session");
            setUser(null);
            setUserRole(null);
            setAccessLevel("public");
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Auth init error:", error);
        if (mounted) {
          setUser(null);
          setUserRole(null);
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth event:", event);

      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          setAccessLevel("authenticated");

          // ALWAYS verify role from database on auth changes
          console.log("🔍 Verifying role from database...");
          const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("❌ Error fetching role:", error);
            setUserRole(null);
          } else if (profile?.role) {
            console.log("✅ Role verified:", profile.role);
            setUserRole(profile.role);
          } else {
            setUserRole(null);
          }
        } else {
          setUser(null);
          setUserRole(null);
          setAccessLevel("public");
        }

        setLoading(false);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Helper functions
  const isAuthenticated = () => !!user;
  const isPublic = () => accessLevel === "public";

  const setPublicAccess = () => {
    setAccessLevel("public");
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Don't set loading to false here - let the auth state change handler do it
      // This prevents race conditions
      if (error) {
        setLoading(false);
      }

      return { data, error };
    } catch (error) {
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    console.log("🚪 Signing out...");

    // Clear everything immediately
    setUser(null);
    setUserRole(null);
    setAccessLevel("public");
    setLoading(false);

    // Clear all localStorage (including Supabase tokens)
    localStorage.clear();

    // Clear Supabase session
    await supabase.auth.signOut();

    return { error: null };
  };

  const value = {
    user,
    userRole,
    accessLevel,
    loading,
    isAuthenticated,
    isPublic,
    setPublicAccess,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

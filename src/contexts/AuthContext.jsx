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
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [accessLevel, setAccessLevel] = useState("public");
  const [loading, setLoading] = useState(true);

  // Simple auth state check
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");

        // Get session without timeout for now to avoid issues
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          console.log(
            "✅ Initial session:",
            session?.user?.email || "No session"
          );
          setSession(session);
          setUser(session?.user || null);
          setAccessLevel(session?.user ? "authenticated" : "public");

          // Fetch user profile if user exists
          if (session?.user) {
            console.log("🔍 User exists, fetching profile...");

            // Try to restore from localStorage immediately for faster UI
            try {
              const cached = localStorage.getItem("userProfile");
              if (cached) {
                const cachedProfile = JSON.parse(cached);
                if (cachedProfile.id === session.user.id) {
                  console.log("📦 Restoring cached profile for immediate UI");
                  setUserProfile(cachedProfile);
                }
              }
            } catch (error) {
              console.warn("Failed to restore cached profile:", error);
            }

            await fetchUserProfile(session.user.id, session.user.email);
          } else {
            console.log("❌ No user in session");
          }

          console.log(
            "✅ Auth initialization complete, setting loading to false"
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          // Set to public access if auth fails
          setSession(null);
          setUser(null);
          setAccessLevel("public");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth event:", event, session?.user?.email || "No user");
      if (mounted) {
        setSession(session);
        setUser(session?.user || null);
        setAccessLevel(session?.user ? "authenticated" : "public");

        // Fetch user profile if user exists
        if (session?.user) {
          console.log("🔍 Auth change - fetching profile...");
          await fetchUserProfile(session.user.id, session.user.email);
        } else {
          console.log("❌ Auth change - no user, clearing profile");
          setUserProfile(null);
          // Clear cached profile when no user
          try {
            localStorage.removeItem("userProfile");
          } catch (error) {
            console.warn(
              "Failed to clear cached profile on auth change:",
              error
            );
          }
        }

        console.log("✅ Auth state change complete, setting loading to false");
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId, userEmail = null) => {
    try {
      console.log("🔍 Fetching user profile for:", userId);

      // Try to restore from localStorage first as fallback
      let cachedProfile = null;
      try {
        const cached = localStorage.getItem("userProfile");
        if (cached) {
          cachedProfile = JSON.parse(cached);
          if (cachedProfile.id === userId) {
            console.log("📦 Found cached user profile");
          } else {
            cachedProfile = null; // Different user
          }
        }
      } catch (error) {
        console.warn("Failed to parse cached user profile:", error);
      }

      // Query the user_profiles table using the user ID
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching user profile:", error);

        // If no profile exists, create a default one
        if (error.code === "PGRST116") {
          console.log("📝 Creating default user profile");
          const { data: newProfile, error: createError } = await supabase
            .from("user_profiles")
            .insert([
              {
                id: userId,
                role: "user", // Default role
                email: userEmail || "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error("❌ Error creating user profile:", createError);
            // Use cached profile as fallback if available
            if (cachedProfile) {
              console.log("📦 Using cached profile as fallback");
              setUserProfile(cachedProfile);
            }
            return;
          }

          console.log("✅ Created user profile:", newProfile);
          setUserProfile(newProfile);
        } else {
          // For other errors, try to use cached profile
          if (cachedProfile) {
            console.log("📦 Using cached profile due to fetch error");
            setUserProfile(cachedProfile);
          }
        }
        return;
      }

      console.log("✅ Fetched user profile:", data);
      setUserProfile(data);

      // Store user profile in localStorage as backup
      try {
        localStorage.setItem("userProfile", JSON.stringify(data));
      } catch (error) {
        console.warn("Failed to store user profile in localStorage:", error);
      }
    } catch (error) {
      console.error("❌ Exception fetching user profile:", error);
    }
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

  const signUp = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    console.log("Signing out...");

    // Clear local state immediately
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setAccessLevel("public");
    setLoading(false);

    // Clear localStorage
    localStorage.clear();

    // Clear Supabase session (fire and forget)
    supabase.auth.signOut().catch(() => {
      // Ignore errors - we've already cleared local state
    });

    return { error: null };
  };

  const setPublicAccess = () => {
    setAccessLevel("public");
  };

  const isPublic = accessLevel === "public";
  const isAuthenticated = !!user;

  const value = {
    user,
    session,
    userProfile,
    accessLevel,
    loading,
    isPublic,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    setPublicAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

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
            await fetchUserProfile(session.user.id);
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
          await fetchUserProfile(session.user.id);
        } else {
          console.log("❌ Auth change - no user, clearing profile");
          setUserProfile(null);
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
  const fetchUserProfile = async (userId) => {
    try {
      console.log("🔍 Fetching user profile for:", userId);

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
                email: user?.email || "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error("❌ Error creating user profile:", createError);
            return;
          }

          console.log("✅ Created user profile:", newProfile);
          setUserProfile(newProfile);
        }
        return;
      }

      console.log("✅ Fetched user profile:", data);
      setUserProfile(data);
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

    // Clear everything immediately
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setAccessLevel("public");
    localStorage.clear();

    // Let Supabase clean up in background
    supabase.auth
      .signOut()
      .catch((err) => console.log("Supabase signOut ignored:", err));

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

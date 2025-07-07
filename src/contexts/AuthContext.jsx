import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ROLES } from "../utils/roles";

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
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [accessLevel, setAccessLevel] = useState("public"); // 'public' or 'authenticated';

  // Function to fetch user profile
  const fetchUserProfile = async (userId) => {
    if (!userId) {
      setUserProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profile_session")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        // If profile doesn't exist, create one with default role
        if (error.code === "PGRST116") {
          console.log("Creating default profile for user:", userId);
          const { data: newProfile, error: createError } = await supabase
            .from("profile_session")
            .insert([{ user_id: userId, role: ROLES.USER }])
            .select()
            .single();

          if (createError) {
            console.error("Error creating user profile:", createError);
            setUserProfile({ role: ROLES.USER }); // Fallback
          } else {
            setUserProfile(newProfile);
          }
        } else {
          setUserProfile({ role: ROLES.USER }); // Fallback
        }
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      setUserProfile({ role: ROLES.USER }); // Fallback
    }
  };



  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Checking initial session...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else {
          console.log("Initial session:", session ? "Found" : "None");
          setSession(session);
          setUser(session?.user ?? null);
          setAccessLevel(session?.user ? "authenticated" : "public");

          // Fetch user profile if user exists
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setAccessLevel(session?.user ? "authenticated" : "public");

      // Fetch user profile if user exists
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }

      console.log("Sign in successful:", data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, options = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Starting sign out process...");
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error);
        throw error;
      }
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setAccessLevel("public");
      
      console.log("Sign out successful, state cleared");
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error("Reset password error:", error);
      return { data: null, error };
    }
  };

  const setPublicAccess = () => {
    setAccessLevel("public");
    console.log("Access level set to public");
  };

  // Function to update user profile
  const updateUserProfile = async (updates) => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    try {
      const { data, error } = await supabase
        .from("profile_session")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    userProfile,
    accessLevel,
    isAuthenticated: accessLevel === "authenticated",
    isPublic: accessLevel === "public",
    signIn,
    signUp,
    signOut,
    resetPassword,
    setPublicAccess,
    updateUserProfile,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

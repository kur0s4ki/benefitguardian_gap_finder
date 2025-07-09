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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session?.user?.email || "No session");
      setSession(session);
      setUser(session?.user || null);
      setAccessLevel(session?.user ? "authenticated" : "public");
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session?.user?.email || "No user");
        setSession(session);
        setUser(session?.user || null);
        setAccessLevel(session?.user ? "authenticated" : "public");
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { data, error };
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
    supabase.auth.signOut().catch(err => console.log("Supabase signOut ignored:", err));
    
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

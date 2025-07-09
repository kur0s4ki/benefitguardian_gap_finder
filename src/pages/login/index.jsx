import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ui/ToastProvider";
import Icon from "../../components/AppIcon";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      const from =
        location.state?.from?.pathname || "/profession-selection-landing";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location.state]);

  // Add timeout for loading state to prevent infinite spinner
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.warn("Auth loading timeout - forcing show login form");
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      addToast("Please fill in all fields", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        // Handle specific error types
        if (error.message.includes("Invalid login credentials")) {
          addToast("Invalid email or password. Please try again.", "error");
        } else if (error.message.includes("Email not confirmed")) {
          addToast(
            "Please check your email and confirm your account before signing in.",
            "warning"
          );
        } else {
          addToast(
            error.message || "An error occurred during sign in",
            "error"
          );
        }
        return;
      }

      if (data?.user) {
        addToast("Successfully signed in!", "success");

        // Handle different redirect scenarios
        if (location.state?.returnAfterLogin && location.state?.profession) {
          // User came from profession selection, redirect back with profession data
          navigate(
            `/profession-selection-landing?returnAfterLogin=true&profession=${location.state.profession}`,
            {
              replace: true,
            }
          );
        } else {
          // Default redirect to intended destination
          const from =
            location.state?.from?.pathname || "/profession-selection-landing";
          navigate(from, {
            replace: true,
            state: location.state?.profession
              ? {
                  profession: location.state.profession,
                }
              : undefined,
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      addToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    addToast(
      "Password reset functionality coming soon. Please contact support if needed.",
      "info"
    );
  };

  // Show loading spinner while checking authentication (with timeout fallback)
  if (loading && !loadingTimeout) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Shield" size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to access your complete retirement analysis
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
                <Icon
                  name="Mail"
                  size={20}
                  className="absolute right-3 top-3.5 text-text-muted"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-text-muted hover:text-text-secondary transition-colors"
                  disabled={isSubmitting}
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary-700 transition-colors"
                disabled={isSubmitting}
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
              <Icon name="TestTube" size={16} />
              Test Credentials
            </h3>
            <div className="text-sm text-text-secondary space-y-1">
              <p>
                <strong>Email:</strong> admin@publicserv.com
              </p>
              <p>
                <strong>Password:</strong> admin@96
              </p>
            </div>
          </div>

          {/* Back to Calculator Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/profession-selection-landing")}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 mx-auto"
            >
              <Icon name="ArrowLeft" size={16} />
              Back to Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

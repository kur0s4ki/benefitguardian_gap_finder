import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ui/ToastProvider";
import Icon from "../../components/AppIcon";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signIn, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from =
        location.state?.from?.pathname || "/profession-selection-landing";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrors({
            general: "Invalid email or password. Please try again.",
          });
        } else if (error.message.includes("Email not confirmed")) {
          setErrors({
            general:
              "Please check your email and confirm your account before signing in.",
          });
        } else {
          setErrors({
            general: error.message || "An error occurred during sign in.",
          });
        }
        addToast("Sign in failed. Please check your credentials.", "error");
      } else {
        addToast("Successfully signed in!", "info");
        const from =
          location.state?.from?.pathname || "/profession-selection-landing";
        const profession = location.state?.profession;

        if (from === "/service-profile-collection" && profession) {
          navigate(from, {
            state: { profession },
            replace: true,
          });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
      addToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    addToast("Forgot password feature coming soon!", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Shield" size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text-primary">Welcome Back</h2>
          <p className="mt-2 text-text-secondary">
            Sign in to access your retirement gap analysis
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon
                    name="AlertCircle"
                    size={20}
                    className="text-error flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-error-700">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Mail" size={18} className="text-text-secondary" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  className={`input-field w-full pl-10 pr-4 py-3 ${
                    errors.email
                      ? "border-error focus:border-error focus:ring-error-100"
                      : ""
                  } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email}</p>
              )}
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Lock" size={18} className="text-text-secondary" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={`input-field w-full pl-10 pr-12 py-3 ${
                    errors.password
                      ? "border-error focus:border-error focus:ring-error-100"
                      : ""
                  } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors duration-150"
                >
                  <Icon
                    name={showPassword ? "EyeOff" : "Eye"}
                    size={18}
                    className="text-text-secondary hover:text-primary"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="text-sm text-primary hover:text-primary-700 transition-colors duration-150"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-primary w-full py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                isLoading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:bg-primary-700"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{" "}
              <button
                onClick={() =>
                  addToast("Account registration coming soon!", "info")
                }
                className="text-primary hover:text-primary-700 font-medium transition-colors duration-150"
              >
                Contact us for access
              </button>
            </p>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="card p-4 bg-primary-50 border-primary-200">
          <div className="text-center">
            <h3 className="text-sm font-medium text-primary-800 mb-2">
              Test Access
            </h3>
            <p className="text-xs text-primary-700 mb-2">
              Use these credentials to access the application:
            </p>
            <div className="text-xs text-primary-600 space-y-1">
              <p>
                <strong>Email:</strong> admin@publicserv.com
              </p>
              <p>
                <strong>Password:</strong> admin@96
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

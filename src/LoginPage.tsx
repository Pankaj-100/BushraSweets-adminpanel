import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./store/authApi";
import { setCredentials } from "./store/authSlice";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner"; // Import toast
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();

      if (res.success) {
        dispatch(setCredentials({ token: res.token, user: res.user }));
        toast.success("Login successful! Redirecting...");
        navigate("/admin/dashboard");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error?.status === 401) {
        toast.error("Invalid credentials. Please check your email and password.");
      } else if (error?.status === 400) {
        toast.error(error?.data?.message || "Invalid request");
      } else if (error?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.status === 404) {
        toast.error("Service not available. Please try again later.");
      } else if (error?.status === 403) {
        toast.error("Access denied. Please contact administrator.");
      } else {
        toast.error(error?.data?.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
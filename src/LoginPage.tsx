import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./store/authApi";
import { setCredentials } from "./store/authSlice";
import { Eye, EyeOff } from "lucide-react";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // new state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();

      if (res.success) {
        dispatch(setCredentials({ token: res.token, user: res.user }));
        navigate("/admin/dashboard");
      } else {
        alert(res.message);
      }
    } catch (error: any) {
      alert(error?.data?.message || "Login failed");
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
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import "../styles/login.css"
import { loginUser } from '../api/auth'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

export default function Login() {

  const [error, setError] = useState("");

  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (formVerification(email, password)) {
      return;
    }

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access);
      localStorage.setItem("username", data.username);
      alert("Login successful!");

      navigate("/dashboard");

    } catch (error) {
      setError(error.message);
    }
  };

  function formVerification(email, password) {
    let error = ""; 
    if (!email || !password) {
      error += "Please fill in all fields. \n";
    }
    if (password.length < 8 && password.length > 0) {
      error += "Password must be at least 8 characters long.";
    }
    setError(error);
    return error.length > 0;
  }

  return (
    <> 
      <div className="login-root">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-brand">
            <span className="login-brand-dot" />
            Smart Pocket Assistant
          </div>
          <h1 className="login-headline">
            Your finances,<br /><span>clearly.</span>
          </h1>
          <p className="login-sub">
            Upload your bank statements and unlock powerful insights into your spending habits.
          </p>
          <div className="login-decoration">
            <div className="deco-line" />
            <span className="deco-text">Secure & Private</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-card">
            <form onSubmit={handleLogin}>
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to your account</p>

            <div className="field-wrapper">
              <label className="field-label">Email Address</label>
              <div className="field-input-wrap">
                <FiMail className="field-icon" />
                <input className="custom-input" type="email"  name='email' placeholder="you@example.com" />
              </div>
            </div>

            <div className="field-wrapper">
              <label className="field-label">Password</label>
              <div className="field-input-wrap">
                <FiLock className="field-icon" />
                <input className="custom-input"  name='password' type="password" placeholder="••••••••" />
              </div>
            </div>

              {error && <p style={{ whiteSpace: 'pre-line', color: '#ff4d4d',textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{error}</p>}
              
              <button className="login-btn" type="submit">
                Sign In <FiArrowRight />
              </button>
            
            <hr className="divider" />

            <p className="login-footer">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi'
import '../styles/signup.css'
import { registerUser } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Signup() {

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const Navigate = useNavigate();

  async function handlesignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (formVerification(username, email, password, formData.get("confirmPassword"))) {
      return;
    }


    try {
      await registerUser(username, email, password);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => Navigate("/login"), 1500);
    } catch (error) {
      setError(error.message);
    }
  }

  function formVerification(username, email, password, confirmPassword) {
    let error = "";
    if (!username || !email || !password || !confirmPassword) {
      error += "Please fill in all fields. \n";
    }
    if (password !== confirmPassword && password.length > 0 && confirmPassword.length > 0) {
      error += "Passwords do not match.";
    }
    if (password.length < 8 && password.length > 0) {
      error += "Password must be at least 8 characters long.";
    }
    if (username.length < 3 && username.length > 0) {
      error += "Username must be at least 3 characters long.";
    }
    setError(error);
    return error.length > 0;
  }

  return (
    <>
      <div className="signup-root">

        {/* Left Panel - Form */}
        <div className="signup-left">
          <div className="signup-card">
            <form onSubmit={handlesignup}>
            <h2>Create account</h2>
            <p className="subtitle">Start analyzing your finances today</p>

            <div className="field-wrapper">
              <label className="field-label">Username</label>
              <div className="field-input-wrap">
                <FiUser className="field-icon" />
                <input className="custom-input" type="text" name='username' placeholder="johndoe" />
              </div>
            </div>

            <div className="field-wrapper">
              <label className="field-label">Email Address</label>
              <div className="field-input-wrap">
                <FiMail className="field-icon" />
                <input className="custom-input" type="email" name='email' placeholder="you@example.com" />
              </div>
            </div>

            <div className="field-wrapper">
              <label className="field-label">Password</label>
              <div className="field-input-wrap">
                <FiLock className="field-icon" />
                <input className="custom-input" type="password" name='password' placeholder="••••••••" />
              </div>
            </div>

            <div className="field-wrapper">
              <label className="field-label">Confirm Password</label>
              <div className="field-input-wrap">
                <FiLock className="field-icon" />
                <input className="custom-input" type="password" name='confirmPassword' placeholder="••••••••" />
              </div>
            </div>
          
            {error && <p style={{ whiteSpace: 'pre-line', color: '#ff4d4d',textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{error}</p>}
            {success && <p style={{ color: '#2ECC71', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{success}</p>}

            <button className="signup-btn" type="submit">
                Create Account <FiArrowRight />
            </button>

            <hr className="divider" />

            <p className="signup-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
            </form>
          </div>
        </div>

        {/* Right Panel - Info */}
        <div className="signup-right">
          <div className="signup-brand">
            <span className="signup-brand-dot" />
            Smart Pocket Assistant
          </div>
          <h1 className="signup-headline">
            Take control of<br />your <span>financial story.</span>
          </h1>
          <div className="perks">
            {[
              'Upload CSV or PDF bank statements instantly',
              'Visualize income vs. expenses over time',
              'AI-powered categorization & insights',
              'Secure — your data stays private',
            ].map((text, i) => (
              <div className="perk-item" key={i}>
                <div className="perk-icon"><FiCheck /></div>
                <span className="perk-text">{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
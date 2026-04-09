import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import "../styles/login.css"


export default function Login() {
  return (
    <> 
      <div className="login-root">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-brand">
            <span className="login-brand-dot" />
            BankAnalyzer
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
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to your account</p>

            <div className="field-wrapper">
              <label className="field-label">Email Address</label>
              <div className="field-input-wrap">
                <FiMail className="field-icon" />
                <input className="custom-input" type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div className="field-wrapper">
              <label className="field-label">Password</label>
              <div className="field-input-wrap">
                <FiLock className="field-icon" />
                <input className="custom-input" type="password" placeholder="••••••••" />
              </div>
            </div>

            <Link to="/dashboard" className="text-decoration-none">
              <button className="login-btn">
                Sign In <FiArrowRight />
              </button>
            </Link>

            <hr className="divider" />

            <p className="login-footer">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
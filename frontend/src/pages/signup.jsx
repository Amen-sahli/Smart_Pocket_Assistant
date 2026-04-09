import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi'
import '../styles/signup.css'

export default function Signup() {
  return (
    <>
      <div className="signup-root">

        {/* Left Panel - Form */}
        <div className="signup-left">
          <div className="signup-card">
            <h2>Create account</h2>
            <p className="subtitle">Start analyzing your finances today</p>

            <div className="field-wrapper">
              <label className="field-label">Username</label>
              <div className="field-input-wrap">
                <FiUser className="field-icon" />
                <input className="custom-input" type="text" placeholder="johndoe" />
              </div>
            </div>

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

            <div className="field-wrapper">
              <label className="field-label">Confirm Password</label>
              <div className="field-input-wrap">
                <FiLock className="field-icon" />
                <input className="custom-input" type="password" placeholder="••••••••" />
              </div>
            </div>

            <Link to="/dashboard" className="text-decoration-none">
              <button className="signup-btn">
                Create Account <FiArrowRight />
              </button>
            </Link>

            <hr className="divider" />

            <p className="signup-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Right Panel - Info */}
        <div className="signup-right">
          <div className="signup-brand">
            <span className="signup-brand-dot" />
            BankAnalyzer
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
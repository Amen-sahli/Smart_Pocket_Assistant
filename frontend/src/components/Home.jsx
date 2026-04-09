import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

export default function Home() {

    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    const barHeights = [35, 60, 45, 75, 55, 80, 65]

    return(
        <section id="home" className="hp-hero">
                  <div className="hero-content">
                    <div className="hero-tag">
                      <span className="hero-tag-dot" />
                      Financial Intelligence
                    </div>
                    <h1 className="hero-title">
                      Your bank data,<br /><em>finally</em> decoded.
                    </h1>
                    <p className="hero-desc">
                      Upload your bank statements and get a full picture of your finances — spending patterns, income trends, and smart insights in seconds.
                    </p>
                    <div className="hero-actions">
                      <Link to="/signup" className="hero-cta">
                        Start for Free <FiArrowRight />
                      </Link>
                      <a href="#" className="hero-cta hero-cta-ghost" onClick={() => scrollTo('services')}>
                        See how it works
                      </a>
                    </div>
                  </div>
        
                  {/* Decorative Visual */}
                  <div className="hero-visual">
                    <div style={{ position: 'relative' }}>
                      <div className="float-card">
                        <div className="float-card-label">Monthly Overview</div>
                        <div className="float-card-value">$12,540</div>
                        <div className="mini-bars">
                          {barHeights.map((h, i) => (
                            <div className="mini-bar" key={i}>
                              <div
                                className={`mini-bar-fill ${i % 3 === 2 ? 'accent' : ''}`}
                                style={{ height: `${h}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="float-card2">
                        <div className="float-c2-label">Net Savings</div>
                        <div className="float-c2-val">+$2,100</div>
                        <div className="float-c2-change">↑ 14.3% this month</div>
                      </div>
                    </div>
                  </div>
                </section>
    )
}
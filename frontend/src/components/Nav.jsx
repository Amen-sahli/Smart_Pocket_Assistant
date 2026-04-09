import { Link } from 'react-router-dom'
export default function Nav() {
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    return(
        <nav className="hp-nav">
          <a className="hp-nav-brand" href="#">
            <span className="brand-dot" />
            BankAnalyzer
          </a>
          <ul className="hp-nav-links">
            <li><a href="#" onClick={() => scrollTo('home')}>Home</a></li>
            <li><a href="#" onClick={() => scrollTo('services')}>Services</a></li>
            <li><Link to="/login" className="nav-btn">Sign In</Link></li>
            <li><Link to="/signup" className="nav-btn nav-btn-accent">Get Started</Link></li>
          </ul>
        </nav>
    )
}

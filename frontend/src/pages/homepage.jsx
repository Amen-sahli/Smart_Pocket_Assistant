import '../styles/homepage.css'
import Nav from '../components/Nav'
import Home from '../components/Home'
import Services from '../components/Services'



export default function Homepage() {
  return (
    <>
      <div className="hp-root">
        <Nav />
        <Home />
        <Services />
        <footer className="hp-footer">
          <div className="footer-brand">BankAnalyzer</div>
          <div className="footer-copy">© 2026 BankAnalyzer · Built with React</div>
        </footer>
      </div>
    </>
  )
}
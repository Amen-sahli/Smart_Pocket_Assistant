import { FiHome, FiBarChart2, FiSettings, FiLogOut} from 'react-icons/fi'
import {Link} from 'react-router-dom'

export default function SideBar({ activeTab, setActiveTab }) {
  
    return(
        <aside className="db-sidebar">
          <div className="sidebar-brand">
            <span className="sidebar-brand-dot" />
            BankAnalyzer
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Menu</div>

            {[
              { icon: <FiHome />, label: 'Dashboard', active: true },
              { icon: <FiBarChart2 />, label: 'Analytics' },
              { icon: <FiSettings />, label: 'Settings' },
            ].map((item) => (
              <a key={item.label} className={`sidebar-item ${item.label === activeTab ? 'active' : ''}`} onClick={() => setActiveTab(item.label)}>
                <span className="sidebar-item-icon">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div className="sidebar-user">
              <div className="sidebar-avatar">JD</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">John Doe</div>
                <div className="sidebar-user-role">Free plan</div>
              </div>
            </div>
            <Link to="/" className="sidebar-item">
              <span className="sidebar-item-icon"><FiLogOut /></span>
              Logout
            </Link>
          </div>
        </aside>
    )
}
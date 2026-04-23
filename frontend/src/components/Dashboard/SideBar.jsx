import { FiHome, FiBarChart2, FiSettings, FiLogOut} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function SideBar({ activeTab, setActiveTab }) {

  const username = localStorage.getItem("username") || "not recognized";

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  
    return(
        <aside className="db-sidebar">
          <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('Dashboard')}>
            <span className="sidebar-brand-dot"/>
            Smart Pocket
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
              <div className="sidebar-avatar">{username.charAt(0).toUpperCase() + username.charAt(1).toUpperCase()}</div>
              <div className="sidebar-user-info">                
                <div className="sidebar-user-name">{username}</div>
                <div className="sidebar-user-role">Free plan</div>
              </div>
            </div>
            <a href="#" className="sidebar-item" onClick={handleLogout}>
              <span className="sidebar-item-icon"><FiLogOut /></span>
              Logout
            </a>
          </div>
        </aside>
    )
}
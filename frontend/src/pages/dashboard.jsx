import '../styles/dashboard.css'
import DashContent from '../components/Dashboard/DashContent'
import SideBar from '../components/Dashboard/SideBar'
import { useState } from 'react'
import Analytics from '../components/Dashboard/Analytics'

export default function Dashboard() {
  
  const [activeTab, setActiveTab] = useState('Dashboard')

  return (
    <>
      <div className="db-root">

        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="db-main">

          {/* TOPBAR */}
          <header className="db-topbar">
            <div>
              <div className="topbar-title">Dashboard</div>
              <div className="topbar-subtitle">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div className="topbar-right">
              <span className="topbar-badge">{new Date().toLocaleDateString()}</span>
            </div>
          </header>

          {/* CONTENT */}   
          {activeTab === 'Dashboard' && <DashContent />}
          {activeTab === 'Analytics' && <Analytics />}
          
        </div>
      </div>
    </>
  )
}
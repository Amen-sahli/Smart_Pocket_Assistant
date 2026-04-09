import '../styles/dashboard.css'
import DashContent from '../components/Dashboard/DashContent'
import SideBar from '../components/Dashboard/SideBar'
import { useState } from 'react'


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
              <div className="topbar-subtitle">Monday, April 06, 2026</div>
            </div>
            <div className="topbar-right">
              <span className="topbar-badge">April 2026</span>
            </div>
          </header>

          {/* CONTENT */}
          {activeTab === 'Dashboard' && <DashContent />}
          
        </div>
      </div>
    </>
  )
}
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from './pages/login'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
import Homepage from './pages/homepage';

function App() {
  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

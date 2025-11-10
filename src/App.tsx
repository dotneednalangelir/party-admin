import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/login/Login'
import Otp from './pages/otp/Otp'
import Panel from './pages/panel/Panel'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp onLogin={handleLogin} />} />
        <Route
          path="/otp"
          element={
            isAuthenticated ? (
              <Navigate to="/panel" replace />
            ) : (
              <Otp onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/panel"
          element={
            isAuthenticated ? <Panel onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App

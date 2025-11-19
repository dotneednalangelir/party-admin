import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/login/Login'
import Otp from './pages/otp/Otp'
import Panel from './pages/panel/Panel'
import { authService } from './services/AuthService'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
  }

  if (loading) {
    return null
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
          path="/panel/*"
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

import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    const checkAuth = () => setIsAuth(!!localStorage.getItem('token'))
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuth(false)
    window.location.reload()
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-6">
        <header className="max-w-3xl mx-auto mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-[30%] bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[3px] shadow"
              aria-hidden="true"
            >
              <div className="w-full h-full bg-white/10 rounded-[28%] flex items-center justify-center relative">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/80" />
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white/80" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">INSTAmator</h1>
          </div>
          <nav className="mt-3 flex items-center gap-4">
            <Link className="text-blue-600" to="/">Home</Link>
            {isAuth && <Link className="text-blue-600" to="/history">History</Link>}
            {!isAuth && (
              <>
                <Link className="text-blue-600" to="/login">Login</Link>
                <Link className="text-blue-600" to="/register">Register</Link>
              </>
            )}
            {isAuth && <button onClick={logout} className="text-red-600">Logout</button>}
          </nav>
        </header>

        <main className="max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<HistoryDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </ErrorBoundary>
  )
}

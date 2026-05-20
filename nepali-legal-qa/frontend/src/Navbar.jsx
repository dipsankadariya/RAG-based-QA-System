import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Scale, Menu, X } from 'lucide-react'
import { UserProfile } from './GoogleLogin'

export function Navbar({ user, onLogout }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/forum', label: 'Community Forum' },
  ]

  return (
    <nav
      style={{
        background: '#EDE8DC',
        borderBottom: '1px solid #C4BAA8',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-black text-lg"
          style={{ color: '#1a1208' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#D6CDB8' }}
          >
            <Scale className="w-5 h-5" strokeWidth={2.5} style={{ color: '#1a1208' }} />
          </div>
          <span>न्याय</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="text-sm font-medium transition-colors"
              style={{
                color: isActive(path) ? '#1a1208' : '#5A5245',
              }}
              onMouseEnter={(e) => {
                if (!isActive(path)) e.target.style.color = '#1a1208'
              }}
              onMouseLeave={(e) => {
                if (!isActive(path)) e.target.style.color = '#5A5245'
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/chat"
            className="text-sm font-medium transition-colors"
            style={{
              color: isActive('/chat') ? '#1a1208' : '#5A5245',
            }}
            onMouseEnter={(e) => {
              if (!isActive('/chat')) e.target.style.color = '#1a1208'
            }}
            onMouseLeave={(e) => {
              if (!isActive('/chat')) e.target.style.color = '#5A5245'
            }}
          >
            Ask AI
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user && <UserProfile user={user} onLogout={onLogout} />}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            style={{
              color: '#1a1208',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F5F0E6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t p-4 flex flex-col gap-3"
          style={{
            borderColor: '#C4BAA8',
            background: '#F5F0E6',
          }}
        >
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              style={{
                color: isActive(path) ? '#F5F0E6' : '#1a1208',
                background: isActive(path) ? '#8B7355' : 'transparent',
              }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/chat"
            className="px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center"
            style={{
              color: isActive('/chat') ? '#F5F0E6' : '#1a1208',
              background: isActive('/chat') ? '#8B7355' : 'transparent',
            }}
            onClick={() => setMobileOpen(false)}
          >
            Ask AI
          </Link>
        </div>
      )}
    </nav>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Scale, Menu, X, ChevronDown } from 'lucide-react'
import { UserProfile } from './GoogleLogin'

export function Navbar({ user, onLogout }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopQuickLinksOpen, setDesktopQuickLinksOpen] = useState(false)
  const [mobileQuickLinksOpen, setMobileQuickLinksOpen] = useState(false)

  const desktopQuickLinksRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/forum', label: 'Community Forum' },
  ]

  const quickLinks = [
    { label: 'GitHub Repository', url: 'https://github.com/dipsankadariya/RAG-based-QA-System', icon: '🔗' },
    { label: 'Dataset', url: 'https://huggingface.co/datasets/chhatramani/Nepali_Legal_QA', icon: '📊' },
    { label: 'Documentation', url: 'https://github.com/dipsankadariya/RAG-based-QA-System/edit/ritesh/README.md', icon: '📖' },
  ]

  useEffect(() => {
    setMobileOpen(false)
    setDesktopQuickLinksOpen(false)
    setMobileQuickLinksOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      setDesktopQuickLinksOpen(false)
      setMobileQuickLinksOpen(false)
    }

    const onPointerDown = (event) => {
      const target = event.target
      if (!(target instanceof Node)) return

      if (desktopQuickLinksRef.current && !desktopQuickLinksRef.current.contains(target)) {
        setDesktopQuickLinksOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileQuickLinksOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

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
                if (!isActive(path)) e.currentTarget.style.color = '#1a1208'
              }}
              onMouseLeave={(e) => {
                if (!isActive(path)) e.currentTarget.style.color = '#5A5245'
              }}
            >
              {label}
            </Link>
          ))}

          {/* Quick Links Dropdown */}
          <div className="relative" ref={desktopQuickLinksRef}>
            <button
              onClick={() => setDesktopQuickLinksOpen((open) => !open)}
              className="flex items-center gap-1 text-sm font-medium transition-colors"
              style={{
                color: '#5A5245',
              }}
              aria-haspopup="menu"
              aria-expanded={desktopQuickLinksOpen}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1a1208'
              }}
              onMouseLeave={(e) => {
                if (!desktopQuickLinksOpen) e.currentTarget.style.color = '#5A5245'
              }}
            >
              Quick Links
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 0.2s',
                  transform: desktopQuickLinksOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {desktopQuickLinksOpen && (
              <div
                className="absolute top-full right-0 mt-2 rounded-lg shadow-lg border z-50"
                style={{
                  background: '#F5F0E6',
                  borderColor: '#C4BAA8',
                  minWidth: '220px',
                }}
                role="menu"
              >
                {quickLinks.map(({ label, url, icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-sm text-left transition-colors hover:bg-white"
                    style={{
                      color: '#1a1208',
                      borderBottom: '1px solid #E8DCC8',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#E8DCC8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#F5F0E6'
                    }}
                    onClick={() => setDesktopQuickLinksOpen(false)}
                    role="menuitem"
                  >
                    <span style={{ marginRight: '8px' }}>{icon}</span>
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/chat"
            className="text-sm font-medium transition-colors"
            style={{
              color: isActive('/chat') ? '#1a1208' : '#5A5245',
            }}
            onMouseEnter={(e) => {
              if (!isActive('/chat')) e.currentTarget.style.color = '#1a1208'
            }}
            onMouseLeave={(e) => {
              if (!isActive('/chat')) e.currentTarget.style.color = '#5A5245'
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
          ref={mobileMenuRef}
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
              onClick={() => {
                setMobileOpen(false)
                setMobileQuickLinksOpen(false)
              }}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Quick Links */}
          <div className="px-4 py-2">
            <button
              onClick={() => setMobileQuickLinksOpen((open) => !open)}
              className="w-full flex items-center justify-between rounded-lg px-0 py-0 text-sm font-medium"
              style={{
                color: '#1a1208',
              }}
              aria-haspopup="menu"
              aria-expanded={mobileQuickLinksOpen}
            >
              Quick Links
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 0.2s',
                  transform: mobileQuickLinksOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {mobileQuickLinksOpen && (
              <div className="mt-2 space-y-1" role="menu">
                {quickLinks.map(({ label, url, icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      color: '#1a1208',
                      background: '#E8DCC8',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#D6CDB8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#E8DCC8'
                    }}
                    onClick={() => {
                      setMobileOpen(false)
                      setMobileQuickLinksOpen(false)
                    }}
                    role="menuitem"
                  >
                    <span style={{ marginRight: '8px' }}>{icon}</span>
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/chat"
            className="px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center"
            style={{
              color: isActive('/chat') ? '#F5F0E6' : '#1a1208',
              background: isActive('/chat') ? '#8B7355' : 'transparent',
            }}
            onClick={() => {
              setMobileOpen(false)
              setMobileQuickLinksOpen(false)
            }}
          >
            Ask AI
          </Link>
        </div>
      )}
    </nav>
  )
}

import { useEffect, useRef, useState } from 'react'

// Add animations
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`
document.head.appendChild(style)

export function GoogleLoginButton({ onLoginSuccess, onLoginError }) {
  const buttonRef = useRef(null)
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('VITE_GOOGLE_CLIENT_ID not set in environment')
      setIsLoading(false)
      return
    }

    // Load Google Identity Services Library
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          locale: 'en',
          width: '400',
        })
        setIsLoading(false)
      }
    }

    script.onerror = () => {
      console.error('Failed to load Google Identity Services')
      setIsLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      try {
        document.head.removeChild(script)
      } catch (e) {}
    }
  }, [GOOGLE_CLIENT_ID])

  const handleCredentialResponse = async (response) => {
    try {
      const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '')
      const endpoint = API_BASE ? `${API_BASE}/api/auth/google` : '/api/auth/google'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token: response.credential }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        onLoginError?.(err.detail ?? `HTTP ${res.status}`)
        return
      }

      const data = await res.json()
      localStorage.setItem('auth_token', data.access_token)
      localStorage.setItem('user_info', JSON.stringify(data.user))
      onLoginSuccess?.(data)
    } catch (error) {
      console.error('Login error:', error)
      onLoginError?.(error.message)
    }
  }

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div style={{
        padding: '16px',
        background: '#FEF3C7',
        border: '1px solid #FBBF24',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '14px', color: '#92400E', fontWeight: '500' }}>⚠️ Google authentication not configured</p>
        <p style={{ fontSize: '12px', color: '#B45309', marginTop: '4px' }}>Set VITE_GOOGLE_CLIENT_ID in your .env.local file</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {isLoading && (
        <div style={{
          width: '100%',
          height: '44px',
          background: '#D6CDB8',
          borderRadius: '8px',
          animation: 'pulse 2s infinite'
        }} />
      )}
      <div ref={buttonRef} style={{ minHeight: isLoading ? '0' : 'auto' }} />
    </div>
  )
}

export function LoginCard({ onLoginSuccess }) {
  const [error, setError] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #EDE8DC, #F5F0E6)', display: 'flex' }}>
      {/* Left Side - Visual Section */}
      <div style={{
        display: 'none',
        width: '50%',
        background: 'linear-gradient(to bottom right, #8B7355, #6B563D)',
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        '@media (min-width: 1024px)': { display: 'flex' }
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '384px',
          height: '384px',
          background: '#A08B6F',
          borderRadius: '50%',
          opacity: 0.2,
          filter: 'blur(3rem)',
          animation: 'pulse 3s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '384px',
          height: '384px',
          background: '#9B8263',
          borderRadius: '50%',
          opacity: 0.2,
          filter: 'blur(3rem)',
          animation: 'pulse 3s infinite 2s'
        }}></div>
        
        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '448px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            color: '#FFFFFF',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V5L12 1z" />
            </svg>
          </div>
          
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '16px' }}>न्याय</h2>
          <p style={{ fontSize: '18px', color: '#E6D9C4', marginBottom: '32px' }}>Your AI-powered guide to Nepali legal insights</p>
          
          {/* Feature List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                marginTop: '4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg className="w-3 h-3" fill="white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p style={{ color: '#FFFFFF', fontWeight: '500' }}>Instant Legal Answers</p>
                <p style={{ fontSize: '14px', color: '#D6CDB8' }}>Get answers to legal questions 24/7</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                marginTop: '4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg className="w-3 h-3" fill="white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p style={{ color: '#FFFFFF', fontWeight: '500' }}>Nepali Legal Context</p>
                <p style={{ fontSize: '14px', color: '#D6CDB8' }}>Guidance specific to Nepal</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                marginTop: '4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg className="w-3 h-3" fill="white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p style={{ color: '#FFFFFF', fontWeight: '500' }}>Conversational Interface</p>
                <p style={{ fontSize: '14px', color: '#D6CDB8' }}>Chat naturally about legal matters</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '24px',
        paddingRight: '24px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                background: 'linear-gradient(to bottom right, #8B7355, #6B563D)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V5L12 1z" />
                </svg>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1208' }}>न्याय</h1>
            </div>
            
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1208', marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ color: '#5A5245' }}>Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Google Login Button */}
            <GoogleLoginButton
              onLoginSuccess={onLoginSuccess}
              onLoginError={(err) => setError(err)}
            />

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '16px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px'
              }}>
                <p style={{ fontSize: '14px', color: '#991B1B', fontWeight: '500' }}>Sign in failed</p>
                <p style={{ fontSize: '14px', color: '#DC2626', marginTop: '4px' }}>{error}</p>
              </div>
            )}

            {/* Divider */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '100%',
                  borderTop: '1px solid #C4BAA8'
                }} />
              </div>
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '14px'
              }}>
                <span style={{
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  background: 'linear-gradient(to bottom right, #EDE8DC, #F5F0E6)',
                  color: '#8B7355',
                  fontWeight: '500'
                }}>Or</span>
              </div>
            </div>

            {/* Guest Button */}
            <button
              onClick={() => {
                localStorage.setItem('auth_token', '')
                localStorage.setItem('user_info', JSON.stringify({ name: 'Guest', email: '', sub: 'guest', picture: null }))
                onLoginSuccess?.({ user: { name: 'Guest', email: '', sub: 'guest', picture: null } })
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1208',
                border: '2px solid #C4BAA8',
                borderRadius: '8px',
                background: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#F5F0E6'
                e.target.style.borderColor = '#8B7355'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#FFFFFF'
                e.target.style.borderColor = '#C4BAA8'
              }}
            >
              Continue as Guest
            </button>

            {/* Footer Text */}
            <p style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#8B7355',
              paddingTop: '8px'
            }}>
              By signing in, you agree to our{' '}
              <a href="#" style={{ color: '#8B7355', fontWeight: '600', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                Terms
              </a>
              {' '}and{' '}
              <a href="#" style={{ color: '#8B7355', fontWeight: '600', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                Privacy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UserProfile({ user, onLogout }) {
  return (
    <div className="flex items-center gap-3">
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          className="w-9 h-9 rounded-full border border-gray-200"
        />
      )}
      <div className="flex-1 min-w-0 hidden sm:block">
        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
        {user.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
      </div>
      <button
        onClick={onLogout}
        className="text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap font-medium"
      >
        Logout
      </button>
    </div>
  )
}

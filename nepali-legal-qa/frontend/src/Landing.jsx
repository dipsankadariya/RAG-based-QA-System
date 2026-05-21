// Landing.jsx

import {
  ArrowRight,
  BookOpen,
  Lock,
  Lightbulb,
  Briefcase,
  Eye,
  CheckCircle2,
  Plus,
  MessageSquare,
  FileSearch,
  Globe,
  Bot,
  Layers,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import justiceImage from './final_3_1.png'

function JusticeFigure() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent', 
      }}
    >
      <img
        src={justiceImage}
        alt="Nepal Lady Justice"
        style={{
          width: '100%', 
          height: '100%',
          objectFit: 'contain',
          mixBlendMode: 'darken', 
          // Added translateY(-8%) to cleanly nudge the image up
          transform: 'scale(1.7) translateY(-8%)', 
        }}
      />
    </div>
  )
}

/* ─── Feature Card ─── */
function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '12px',
        background: '#F5F0E6',
        border: '1px solid #C4BAA8',
        transition: 'all 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#8B7355'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 115, 85, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#C4BAA8'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          background: '#D6CDB8',
          color: '#8B7355',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Icon size={24} />
      </div>

      <h3 style={{
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#1a1208',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '13px',
        color: '#5A5245',
        lineHeight: '1.6',
        fontWeight: '500',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        {desc}
      </p>
    </div>
  )
}

export default function Landing({ user, onLogout }) {
  return (
    <div
      className="min-h-screen text-gray-900"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
        background: '#EDE8DC',
      }}
    >
      <Navbar user={user} onLogout={onLogout} />

      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left */}
            <div className="z-20 relative">
              <h1
                className="font-black leading-[0.92] tracking-tight mb-7"
                style={{
                  fontSize: 'clamp(3.8rem, 7vw, 6.5rem)',
                }}
              >
                <span style={{ color: '#1a1208' }}>Legal </span>

                <span style={{ color: '#8B7355' }}>knowledge</span>

                <br />

                <span style={{ color: '#1a1208' }}>
                  accessible to all.
                </span>
              </h1>

              <p
                className="text-base text-gray-600 leading-relaxed mb-10 max-w-md"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                An end-to-end legal system powered by AI. Get instant answers to legal questions, join our community forum, and understand Nepal's laws in both Nepali and English.
              </p>

              <div className="flex items-center gap-5">
                <Link
                  to="/chat"
                  className="px-7 py-3.5 font-semibold text-white rounded-lg"
                  style={{
                    background: '#1a1208',
                  }}
                >
                  Ask न्याय AI
                </Link>

                <Link
                  to="/about"
                  className="text-[15px] font-semibold rounded-lg px-6 py-3"
                  style={{
                    color: '#1a1208',
                    border: '2px solid #1a1208',
                  }}
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="relative flex justify-center w-full">
              <div
                className="relative w-full"
                style={{
                  height: 'clamp(500px, 80vh, 500px)', 
                  maxWidth: '800px', 
                }}
              >
                <JusticeFigure />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-24"
        style={{ background: '#F5F0E6' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-14">
            <h2
              className="font-black tracking-tight"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: '#1a1208',
              }}
            >
              Core Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            <FeatureCard
              icon={Bot}
              title="Intelligent AI Chatbot"
              desc="Multi-modal chatbot with fine-tuned language model trained on Nepali legal texts and Constitution."
            />

            <FeatureCard
              icon={FileSearch}
              title="2-Stage RAG System"
              desc="HyDE-based retrieval for standard questions + MCP Agent for complex legal research and deep queries."
            />

            <FeatureCard
              icon={CheckCircle2}
              title="Constitution-Backed"
              desc="All answers grounded in Nepal's Constitution (2076 articles), Acts, and legal frameworks with citations."
            />

            <FeatureCard
              icon={MessageSquare}
              title="Community Forum"
              desc="Post legal queries, get answers from community members. Upvote, downvote, and comment on discussions."
            />

            <FeatureCard
              icon={Globe}
              title="Bilingual Support"
              desc="Ask questions and receive answers in both Nepali and English for better understanding."
            />

            <FeatureCard
              icon={Layers}
              title="Flexible Authentication"
              desc="Sign in with Google OAuth for personalized experience or use as a guest for quick access."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24" style={{ background: '#EDE8DC', borderTop: '1px solid #C4BAA8' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <h2
              className="font-black tracking-tight"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: '#1a1208',
              }}
            >
              Our Three-Pillar Approach
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1208', marginBottom: '12px' }}>Simple Questions</h3>
                <p style={{ fontSize: '14px', color: '#5A5245', lineHeight: '1.6', fontWeight: '500' }}>
                  Our HyDE-based RAG system retrieves the most relevant constitutional articles and legal sections, then generates instant answers with citations.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1208', marginBottom: '12px' }}>Deep Research</h3>
                <p style={{ fontSize: '14px', color: '#5A5245', lineHeight: '1.6', fontWeight: '500' }}>
                  For complex legal queries, activate Agent mode to perform comprehensive research across multiple sources and provide detailed analysis.
                </p>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1208', marginBottom: '12px' }}>Community Discussion</h3>
                <p style={{ fontSize: '14px', color: '#5A5245', lineHeight: '1.6', fontWeight: '500' }}>
                  Post your legal questions in our community forum. Get answers from other users and legal experts. Upvote helpful responses.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1208', marginBottom: '12px' }}>Multilingual Support</h3>
                <p style={{ fontSize: '14px', color: '#5A5245', lineHeight: '1.6', fontWeight: '500' }}>
                  Ask questions in Nepali or English. All answers are available in both languages for maximum accessibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ background: '#1a1208' }}
        className="py-28 text-center"
      >
        <div className="max-w-4xl mx-auto px-6">

          <h2
            className="font-black leading-tight tracking-tight mb-6"
            style={{
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              color: '#F5F0E6',
            }}
          >
            Your rights, simplified.
          </h2>

          <p
            className="text-base mb-12 max-w-lg mx-auto leading-relaxed"
            style={{
              color: '#9A8C78',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Make informed legal decisions with AI-powered guidance grounded in Nepal's Constitution and laws.
          </p>

          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-10 py-5 font-semibold rounded-lg"
            style={{
              background: '#D6CDB8',
              color: '#1a1208',
            }}
          >
            Ask न्याय AI
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: '#F5F0E6',
          borderTop: '1px solid #C4BAA8',
          padding: '40px 24px 24px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Top Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(to bottom right, #8B7355, #6B563D)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EDE8DC',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V5L12 1z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1208' }}>न्याय</h3>
            </div>

            {/* Main Links */}
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <Link to="/chat" style={{ fontSize: '13px', color: '#1a1208', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#8B7355'} onMouseLeave={(e) => e.target.style.color = '#1a1208'}>
                Ask Questions
              </Link>
              <Link to="/forum" style={{ fontSize: '13px', color: '#1a1208', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#8B7355'} onMouseLeave={(e) => e.target.style.color = '#1a1208'}>
                Community
              </Link>
              <Link to="/about" style={{ fontSize: '13px', color: '#1a1208', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#8B7355'} onMouseLeave={(e) => e.target.style.color = '#1a1208'}>
                About
              </Link>
              <a href="#" style={{ fontSize: '13px', color: '#1a1208', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#8B7355'} onMouseLeave={(e) => e.target.style.color = '#1a1208'}>
                Privacy
              </a>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #C4BAA8', paddingTop: '20px' }}>
            <p style={{ fontSize: '12px', color: '#5A5245', textAlign: 'center', margin: 0 }}>
              © 2024 न्याय. Not a substitute for professional legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
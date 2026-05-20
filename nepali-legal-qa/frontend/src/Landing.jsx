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

/* ─── Lady Justice SVG ─── */
function JusticeFigure() {
  return (
    <svg
      viewBox="0 0 340 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Scales arm */}
      <line
        x1="60"
        y1="108"
        x2="280"
        y2="88"
        stroke="#9A8C78"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="170"
        y1="98"
        x2="170"
        y2="135"
        stroke="#9A8C78"
        strokeWidth="2.5"
      />

      {/* Left pan chains */}
      <line
        x1="60"
        y1="108"
        x2="48"
        y2="148"
        stroke="#9A8C78"
        strokeWidth="1.5"
      />
      <line
        x1="60"
        y1="108"
        x2="72"
        y2="148"
        stroke="#9A8C78"
        strokeWidth="1.5"
      />

      {/* Left pan */}
      <path
        d="M38 148 Q60 162 82 148"
        stroke="#9A8C78"
        strokeWidth="2"
        fill="none"
      />

      {/* Right pan chains */}
      <line
        x1="280"
        y1="88"
        x2="268"
        y2="128"
        stroke="#9A8C78"
        strokeWidth="1.5"
      />
      <line
        x1="280"
        y1="88"
        x2="292"
        y2="128"
        stroke="#9A8C78"
        strokeWidth="1.5"
      />

      {/* Right pan */}
      <path
        d="M258 128 Q280 142 302 128"
        stroke="#9A8C78"
        strokeWidth="2"
        fill="none"
      />

      {/* Head */}
      <ellipse cx="170" cy="68" rx="28" ry="32" fill="#C8BC9F" />

      {/* Blindfold */}
      <rect x="144" y="58" width="52" height="13" rx="6.5" fill="#8B7355" />

      {/* Hair */}
      <path
        d="M143 52 Q155 35 170 38 Q185 35 197 52"
        fill="#9A8263"
      />

      <path
        d="M142 55 Q138 80 143 95"
        stroke="#9A8263"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M198 55 Q202 80 197 95"
        stroke="#9A8263"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Neck */}
      <rect x="160" y="98" width="20" height="18" rx="4" fill="#C0B499" />

      {/* Left arm */}
      <path
        d="M145 130 Q110 118 65 110"
        stroke="#B8AC92"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M145 130 Q112 120 68 112"
        stroke="#C8BC9F"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right arm */}
      <path
        d="M195 130 Q220 145 235 180"
        stroke="#B8AC92"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M195 130 Q220 147 234 182"
        stroke="#C8BC9F"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Sword */}
      <line
        x1="234"
        y1="182"
        x2="268"
        y2="460"
        stroke="#8B7355"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Sword guard */}
      <rect x="224" y="176" width="20" height="9" rx="3" fill="#9A8263" />
      <rect x="228" y="173" width="12" height="6" rx="2" fill="#B09870" />

      {/* Torso */}
      <path
        d="M148 116 Q128 128 118 155 Q105 195 100 240 L102 380 Q140 395 170 397 Q200 395 238 380 L238 245 Q233 195 220 155 Q210 128 192 116 Q175 108 148 116Z"
        fill="#C0B495"
      />

      {/* Robe folds */}
      <path
        d="M148 120 Q145 180 148 250 Q150 300 152 380"
        stroke="#B0A488"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      <path
        d="M170 115 Q168 175 170 255 Q171 305 172 397"
        stroke="#B0A488"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />

      <path
        d="M192 120 Q195 180 192 250 Q190 300 188 380"
        stroke="#B0A488"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* Belt */}
      <path
        d="M108 210 Q170 225 232 210"
        stroke="#8B7355"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M108 210 Q170 225 232 210"
        stroke="#9A8263"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Belt decoration */}
      <rect x="157" y="206" width="26" height="16" rx="3" fill="#8B7355" />
      <rect x="161" y="209" width="18" height="10" rx="2" fill="#9A8263" />

      {/* Lower robe */}
      <path
        d="M102 380 Q88 420 82 480 L258 480 Q252 420 238 380 Q200 395 170 397 Q140 395 102 380Z"
        fill="#B8AD92"
      />

      {/* Base */}
      <rect x="68" y="480" width="204" height="22" rx="4" fill="#A89D82" />
      <rect x="58" y="499" width="224" height="14" rx="4" fill="#9A8C78" />
    </svg>
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

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left */}
            <div>
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
            <div className="relative flex justify-center">
              <div
                className="relative z-10"
                style={{
                  height: '650px',
                  width: '300px',
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
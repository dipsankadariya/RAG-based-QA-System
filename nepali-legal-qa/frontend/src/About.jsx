import { Link } from 'react-router-dom'
import { Scale, BookOpen, Users, Zap, ArrowRight } from 'lucide-react'
import { Navbar } from './Navbar'

export function About({ user, onLogout }) {
  return (
    <div
      className="min-h-screen text-gray-900"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
        background: '#EDE8DC',
      }}
    >
      <Navbar user={user} onLogout={onLogout} />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1
          className="font-black mb-6 tracking-tight leading-tight"
          style={{
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#1a1208',
          }}
        >
          About न्याय
        </h1>
        <p
          className="text-lg leading-relaxed max-w-3xl"
          style={{
            color: '#5A5245',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 500,
          }}
        >
          न्याय is an end-to-end legal information system designed to make Nepal's laws and constitutional knowledge accessible to every citizen. Built with advanced AI and machine learning, we provide instant, accurate answers grounded in Nepal's Constitution and legal frameworks.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: '#C4BAA8' }}>
        <h2
          className="font-black mb-8 tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#1a1208',
          }}
        >
          Our Mission & Vision
        </h2>
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1208', marginBottom: '12px' }}>Mission</h3>
            <p
              className="text-lg leading-relaxed"
              style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}
            >
              Make law accessible to all citizens of Nepal, regardless of their background or resources. We bridge the gap between complex legal documents and everyday people by providing instant, transparent, and verifiable legal guidance.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1208', marginBottom: '12px' }}>Vision</h3>
            <p
              className="text-lg leading-relaxed"
              style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}
            >
              A future where every Nepali citizen can understand their constitutional rights and legal obligations through AI-powered guidance, fostering a more informed and empowered society.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: '#C4BAA8' }}>
        <h2
          className="font-black mb-12 tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#1a1208',
          }}
        >
          Our Three-Pillar Approach
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: 'Two-Stage AI System',
              desc: 'Stage 1: HyDE RAG for standard legal questions. Stage 2: MCP Agent for complex research requiring deep analysis and cross-referencing.',
            },
            {
              icon: Zap,
              title: 'HyDE Retrieval Technology',
              desc: 'Generates hypothetical legal passages before searching. Improves accuracy in low-resource languages like Nepali by bridging the gap between questions and answer passages.',
            },
            {
              icon: Users,
              title: 'Community-Driven Insights',
              desc: 'Users can post questions in our forum, get answers from community members and legal experts, upvote helpful responses, and engage in discussions.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border rounded-lg p-6 transition-all hover:shadow-lg"
              style={{
                borderColor: '#C4BAA8',
                background: '#F5F0E6',
              }}
            >
              <item.icon className="w-8 h-8 mb-4" style={{ color: '#8B7355' }} />
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1a1208' }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: '#C4BAA8' }}>
        <h2
          className="font-black mb-8 tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#1a1208',
          }}
        >
          Technical Architecture
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1208' }}>
              AI & Machine Learning
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}>
              <li>• <strong>Fine-tuned Qwen 2.5 (1.5B)</strong> — Custom trained on Nepali legal texts for HyDE passage generation</li>
              <li>• <strong>HyDE Retrieval System</strong> — Generates hypothetical legal passages for better semantic matching</li>
              <li>• <strong>LaBSE Embeddings</strong> — Multilingual embeddings for semantic understanding in Nepali and English</li>
              <li>• <strong>FAISS Vector Store</strong> — Efficient similarity search over Constitution and legal documents</li>
              <li>• <strong>Groq Hosted LLM</strong> — High-speed final answer generation (round-robin API keys for reliability)</li>
              <li>• <strong>MCP Agent</strong> — Advanced agent for complex research queries requiring multi-step reasoning</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1208' }}>
              Platform & Infrastructure
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}>
              <li>• <strong>FastAPI</strong> — Backend server (runs on Google Colab with GPU T4)</li>
              <li>• <strong>React + Vite</strong> — Modern, fast frontend framework</li>
              <li>• <strong>Google OAuth</strong> — Secure authentication with Google accounts</li>
              <li>• <strong>SQLite</strong> — Community forum database for questions, answers, and discussions</li>
              <li>• <strong>LangChain</strong> — Orchestration for RAG and Agent workflows</li>
              <li>• <strong>ngrok</strong> — Secure tunneling for public access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: '#C4BAA8' }}>
        <h2
          className="font-black mb-8 tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#1a1208',
          }}
        >
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1208' }}>
              AI-Powered Q&A
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}>
              <li>✓ Ask questions in Nepali or English</li>
              <li>✓ Get instant answers with cited sources</li>
              <li>✓ Access 2076 constitutional articles</li>
              <li>✓ Browse 50+ Nepali Acts and Laws</li>
              <li>✓ 24/7 availability without appointment</li>
              <li>✓ HyDE + Agent modes for different queries</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1208' }}>
              Community Forum
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}>
              <li>✓ Post legal questions as forum threads</li>
              <li>✓ Get answers from community and experts</li>
              <li>✓ Upvote and downvote helpful responses</li>
              <li>✓ Comment and discuss legal topics</li>
              <li>✓ Build collective legal knowledge</li>
              <li>✓ Transparent source citations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: '#C4BAA8' }}>
        <h2
          className="font-black mb-8 tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#1a1208',
          }}
        >
          Easy Access
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1208' }}>Google Authentication</h3>
            <p className="text-sm" style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}>
              Sign in with your Google account for a personalized experience. Save your questions, track forum discussions, and maintain your legal query history for future reference.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1208' }}>Guest Access</h3>
            <p className="text-sm" style={{ color: '#5A5245', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 500 }}>
              No account needed. Use न्याय instantly as a guest to ask questions and browse the community forum. Start learning about Nepali law immediately.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-28 text-center border-t"
        style={{
          background: '#1a1208',
          borderColor: '#C4BAA8',
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="font-black leading-tight tracking-tight mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: '#F5F0E6',
            }}
          >
            Empower Your Legal Knowledge
          </h2>
          <p
            className="text-base mb-12 max-w-lg mx-auto leading-relaxed"
            style={{
              color: '#9A8C78',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 500,
            }}
          >
            Start your journey to understanding Nepal's legal system. Ask questions, explore the Constitution, and join our community of informed citizens.
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-10 py-5 font-semibold rounded-lg"
            style={{
              background: '#D6CDB8',
              color: '#1a1208',
            }}
          >
            Start Using न्याय
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12"
        style={{
          borderTop: '1px solid #C4BAA8',
          background: '#F5F0E6',
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-sm" style={{ color: '#8B7355' }}>
            <p>Built for Nepal. Powered by AI-driven RAG technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

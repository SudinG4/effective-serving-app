import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CircleHelp,
  Clock3,
  Download,
  FileText,
  HeartPulse,
  RotateCcw,
  Settings,
  Sparkles,
  UsersRound,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Activity,
  HeartHandshake,
  ShieldCheck,
  Compass,
  Smile,
  LogOut,
  Calendar,
  Layers,
  Printer
} from 'lucide-react';

import {
  BottomNav,
  Disclaimer,
  featureData,
  Footer,
  Logo,
  PublicHeader
} from './components';

import {
  domains,
  initialHistory,
  options,
  questions,
  riskFor
} from './data';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const storage = {
  getUser: () =>
    JSON.parse(localStorage.getItem('wbc-user') || 'null'),

  setUser: (user) =>
    localStorage.setItem('wbc-user', JSON.stringify(user)),

  getAccessToken: () =>
    localStorage.getItem('wbc-access-token'),

  setAccessToken: (token) =>
    localStorage.setItem('wbc-access-token', token),

  clearAuth: () => {
    localStorage.removeItem('wbc-user');
    localStorage.removeItem('wbc-access-token');
    localStorage.removeItem('wbc-account');
  },

  getHistory: () =>
    JSON.parse(
      localStorage.getItem('wbc-history') ||
        JSON.stringify(initialHistory)
    )
};

function profileFromSupabaseUser(user) {
  const metadata = user?.user_metadata || {};

  return {
    id: user?.id || '',
    firstName: metadata.first_name || '',
    lastName: metadata.last_name || '',
    email: user?.email || '',
    phone: metadata.phone || ''
  };
}

/* ==========================================================================
   Home Page
   ========================================================================== */

export function Home() {
  return (
    <>
      <PublicHeader />

      <main>
        {/* Hero Section */}
        <section className="hero-section shell">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <Sparkles size={15} />
                Trauma-Informed & Confidential
              </span>

              <h1>
                Understand your wellbeing with <em>clarity</em> and compassion.
              </h1>

              <p className="lead">
                A respectful, evidence-informed check-in designed especially for caregivers,
                helpers, and community servants to reflect, spot early strain, and access
                meaningful support.
              </p>

              <div className="hero-actions">
                <Link className="button large" to="/quiz">
                  Start Assessment <ArrowRight size={18} />
                </Link>
                <Link className="button large secondary" to="/about">
                  How It Works
                </Link>
              </div>

              <div className="trust-badges">
                <div className="trust-badge">
                  <Clock3 size={16} /> 27 Questions (~8 min)
                </div>
                <div className="trust-badge">
                  <ShieldCheck size={16} /> Private & Confidential
                </div>
                <div className="trust-badge">
                  <FileText size={16} /> Instant Domain Report
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="sample-card">
                <div className="sample-top">
                  <span className="sample-label">Sample Assessment Report</span>
                  <span className="status watch">Moderate Concern</span>
                </div>

                <div className="sample-score-preview">
                  <div className="sample-score-circle">
                    <svg viewBox="0 0 100 100">
                      <circle
                        className="bg-ring"
                        cx="50"
                        cy="50"
                        r="40"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        className="val-ring"
                        cx="50"
                        cy="50"
                        r="40"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="251.2"
                        strokeDashoffset="115.5"
                      />
                    </svg>
                    <div className="score-inner">
                      <span className="score-num">58</span>
                      <span className="score-max">/108</span>
                    </div>
                  </div>

                  <div className="sample-score-meta">
                    <h4>Overall Wellbeing Score</h4>
                    <p>Some areas indicate fatigue. Taking space to rest and talk is recommended.</p>
                  </div>
                </div>

                <div className="sample-bars">
                  <div className="mini-row">
                    <span>Emotional Health</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '65%' }} />
                    </div>
                    <span className="bar-val">15/24</span>
                  </div>

                  <div className="mini-row">
                    <span>Stress & Anxiety</span>
                    <div className="bar-track">
                      <div className="bar-fill accent" style={{ width: '58%' }} />
                    </div>
                    <span className="bar-val">14/24</span>
                  </div>

                  <div className="mini-row">
                    <span>Sleep & Energy</span>
                    <div className="bar-track">
                      <div className="bar-fill sage" style={{ width: '70%' }} />
                    </div>
                    <span className="bar-val">14/20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Five Dimensions Section */}
        <section className="domains-overview-section">
          <div className="shell">
            <div className="section-header">
              <span className="eyebrow">Comprehensive Coverage</span>
              <h2>Five core dimensions of everyday health</h2>
              <p>
                Rather than a one-dimensional score, our screening looks at the interrelated
                pillars that shape how you feel and function each day.
              </p>
            </div>

            <div className="domains-grid">
              <div className="domain-item-card">
                <span className="domain-badge-num">Pillar 01</span>
                <h3>Emotional Health</h3>
                <p>Recognize subtle shifts in mood, optimism, emotional bandwidth, and overwhelm.</p>
              </div>

              <div className="domain-item-card">
                <span className="domain-badge-num">Pillar 02</span>
                <h3>Stress & Anxiety</h3>
                <p>Identify nervousness, physical tension, racing thoughts, and difficulty unwinding.</p>
              </div>

              <div className="domain-item-card">
                <span className="domain-badge-num">Pillar 03</span>
                <h3>Sleep & Energy</h3>
                <p>Understand sleep quality, morning fatigue, and physical vitality patterns.</p>
              </div>

              <div className="domain-item-card">
                <span className="domain-badge-num">Pillar 04</span>
                <h3>Social Connection</h3>
                <p>Evaluate your feelings of isolation, belonging, and emotional support networks.</p>
              </div>

              <div className="domain-item-card">
                <span className="domain-badge-num">Pillar 05</span>
                <h3>Daily Functioning</h3>
                <p>Assess concentration, decision-making ease, and routine maintenance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Us */}
        <section className="section-spacer shell">
          <div className="section-header">
            <span className="eyebrow terracotta">Human-First Design</span>
            <h2>Created to support, never to judge</h2>
            <p>
              Designed with clinical dignity so you can take a moment for yourself with confidence.
            </p>
          </div>

          <div className="features-grid">
            {featureData.map(([Icon, title, text]) => (
              <article className="feature-card" key={title}>
                <div className="feature-icon-wrap">
                  <Icon size={24} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How It Works 3 Steps */}
        <section className="section-spacer shell" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <span className="eyebrow">Simple 3-Step Process</span>
            <h2>How WellBeingCheck works</h2>
            <p>A calm, guided experience designed to fit into your busy schedule.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">1</span>
              <h3>Take the 8-minute check</h3>
              <p>
                Answer 27 gentle, focused questions reflecting on your experiences over the past
                two weeks.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">2</span>
              <h3>Receive your private report</h3>
              <p>
                Instantly view an intuitive breakdown across all 5 wellbeing dimensions with clear,
                supportive commentary.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">3</span>
              <h3>Explore tailored next steps</h3>
              <p>
                Access personalized self-care ideas, conversation starters, or connect with trusted
                health professionals.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="cta-banner">
            <div className="cta-content">
              <h2>Ready to take a moment for yourself?</h2>
              <p>
                No long signups or invasive questions. Start your private assessment right now and
                get immediate clarity.
              </p>
            </div>
            <Link className="button large" to="/quiz">
              Begin Assessment <ArrowRight size={18} />
            </Link>
          </div>

          <Disclaimer />
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ==========================================================================
   Authentication Screens (Login / Signup)
   ========================================================================== */

function AuthShell({ signup = false }) {
  const nav = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  function handleDemoLogin() {
    const demoUser = {
      id: 'demo-user-123',
      firstName: 'Kiran',
      lastName: 'Caregiver',
      email: 'kiran.care@example.com',
      phone: '0412 345 678'
    };
    storage.setUser(demoUser);
    storage.setAccessToken('demo-token-active');
    nav('/dashboard');
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setStatus('');

    const email = form.email.trim().toLowerCase();

    if (signup) {
      if (form.firstName.trim().length < 2) {
        setError('Please enter your first name.');
        return;
      }

      if (form.lastName.trim().length < 2) {
        setError('Please enter your last name.');
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      if (form.phone.trim().length < 8) {
        setError('Please enter a valid contact number.');
        return;
      }

      if (form.password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }
    } else {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      if (form.password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }
    }

    try {
      setLoading(true);

      const endpoint = signup ? 'register' : 'login';

      const payload = signup
        ? {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email,
            phone: form.phone.trim(),
            password: form.password
          }
        : {
            email,
            password: form.password
          };

      const response = await fetch(
        `${API_BASE_URL}/api/auth/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (signup
              ? 'Unable to create account.'
              : 'Unable to log in.')
        );
      }

      if (signup && !data.session) {
        setStatus(
          'Account created successfully! Please check your email to confirm your account, then log in.'
        );

        setForm((current) => ({
          ...current,
          password: ''
        }));

        return;
      }

      if (!data.user || !data.session?.access_token) {
        throw new Error(
          'Authentication succeeded but no active session was returned.'
        );
      }

      storage.setUser(profileFromSupabaseUser(data.user));
      storage.setAccessToken(data.session.access_token);

      nav('/dashboard');
    } catch (err) {
      // Fallback for seamless demo testing if backend is offline
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const fallbackUser = {
          id: 'demo-user-fallback',
          firstName: signup ? form.firstName || 'Friend' : 'Kiran',
          lastName: signup ? form.lastName || 'User' : 'Caregiver',
          email: email || 'user@example.com',
          phone: form.phone || '0412 000 000'
        };
        storage.setUser(fallbackUser);
        storage.setAccessToken('local-session-active');
        nav('/dashboard');
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="shell">
          <Logo />
          <Link className="text-button" to="/">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card-header">
            <div className="auth-icon">
              <HeartPulse size={24} />
            </div>
            <h1>{signup ? 'Create your private account' : 'Welcome back'}</h1>
            <p className="auth-subtitle">
              {signup
                ? 'Begin your evidence-informed wellbeing screening.'
                : 'Log in to view past reports and start a new check-in.'}
            </p>
          </div>

          <div className="quick-demo-login">
            <div>
              <p><strong>Reviewing the app?</strong></p>
              <p>Explore with 1-click demo access.</p>
            </div>
            <button
              type="button"
              className="button small subtle"
              onClick={handleDemoLogin}
            >
              Instant Demo Access
            </button>
          </div>

          {signup && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  className="form-input"
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  placeholder="e.g. Kiran"
                  autoComplete="given-name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  className="form-input"
                  type="text"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  placeholder="e.g. Sharma"
                  autoComplete="family-name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Contact phone number
                </label>
                <input
                  id="phone"
                  className="form-input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="e.g. 0412 345 678"
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-input-wrap">
              <input
                id="password"
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                autoComplete={
                  signup ? 'new-password' : 'current-password'
                }
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}
          {status && <div className="form-status">{status}</div>}

          <button
            className="button full large"
            type="submit"
            disabled={loading}
          >
            {loading
              ? signup
                ? 'Creating Account...'
                : 'Logging In...'
              : signup
                ? 'Create Account'
                : 'Continue to Dashboard'}
            <ArrowRight size={18} />
          </button>

          <p className="switch">
            {signup
              ? 'Already have an account?'
              : 'Don’t have an account yet?'}
            {' '}
            <Link to={signup ? '/login' : '/signup'}>
              {signup ? 'Log in here' : 'Create an account'}
            </Link>
          </p>

          <p className="auth-note">
            Your data is stored with client-side isolation. All assessment results
            remain strictly confidential to your local device.
          </p>
        </form>
      </main>
    </div>
  );
}

export function Login() {
  return <AuthShell />;
}

export function Signup() {
  return <AuthShell signup />;
}

/* ==========================================================================
   Dashboard
   ========================================================================== */

export function Dashboard() {
  const nav = useNavigate();
  const user = storage.getUser();
  const history = storage.getHistory();

  function logout() {
    storage.clearAuth();
    nav('/login');
  }

  // Determine time-aware greeting
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const userName = user?.firstName || 'Friend';
  const latestScore = history[0]?.score ?? 58;
  const latestRisk = riskFor(latestScore);

  return (
    <>
      <header className="dashboard-header">
        <div className="shell dash-head">
          <Logo />

          <div className="user-greeting">
            <div className="user-avatar-pill">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-greeting-text">
              <h1>{timeGreeting}, {userName}</h1>
              <p>Your Private Wellbeing Sanctuary</p>
            </div>
          </div>

          <div className="dash-actions">
            <button
              className="button small secondary"
              onClick={logout}
              aria-label="Logout"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-page shell">
        {/* Start / Continue Hero Banner */}
        <section className="dash-banner">
          <div className="dash-banner-content">
            <span className="eyebrow terracotta">
              <Sparkles size={15} /> A Quiet Moment for Reflection
            </span>
            <h2>Take your regular wellbeing check-in</h2>
            <p>
              Complete the 27-question assessment across five core domains. It only takes about
              8 minutes and provides an instant, actionable breakdown of how you’re tracking.
            </p>

            <div className="quick-facts">
              <span><Layers size={15} /> 5 Dimensions</span>
              <span><Clock3 size={15} /> ~8 Minutes</span>
              <span><ShieldCheck size={15} /> 100% Confidential</span>
            </div>
          </div>

          <Link className="button large terracotta" to="/quiz">
            Start Assessment <ArrowRight size={18} />
          </Link>
        </section>

        {/* Metric Highlights */}
        <section className="dash-stats-grid">
          <article className="stat-card">
            <span className="stat-card-title">Assessments Completed</span>
            <span className="stat-card-value">{history.length}</span>
            <span className="stat-card-sub">Recorded check-ins on this device</span>
          </article>

          <article className="stat-card">
            <span className="stat-card-title">Latest Status</span>
            <span className="stat-card-value" style={{ fontSize: '24px', marginTop: '6px' }}>
              <span className={`status ${latestRisk.className}`}>
                {history[0]?.label || 'No Risk'}
              </span>
            </span>
            <span className="stat-card-sub">Completed on {history[0]?.date || 'Recent'}</span>
          </article>

          <article className="stat-card">
            <span className="stat-card-title">Check-in Cadence</span>
            <span className="stat-card-value">
              {history.length > 1 && history[0].score < history[1].score
                ? 'Improving'
                : 'Steady'}
            </span>
            <span className="stat-card-sub">Recommended every 2–4 weeks</span>
          </article>
        </section>

        {/* History List */}
        <section className="history-section">
          <div className="history-header">
            <div>
              <h2>Past Assessment History</h2>
              <p>Review your historical scores to understand long-term patterns.</p>
            </div>
            <Link className="button small subtle" to="/quiz">
              + New Check-in
            </Link>
          </div>

          <div className="history-list">
            {history.map((item, index) => {
              const risk = riskFor(item.score);

              return (
                <article className="history-row" key={item.date + index}>
                  <div>
                    <span className="history-date">{item.date}</span>
                  </div>

                  <div>
                    <span className="history-score">
                      {item.score} <small>/ 108</small>
                    </span>
                  </div>

                  <div>
                    <span className={`status ${risk.className}`}>
                      {item.label}
                    </span>
                  </div>

                  <div className="history-actions">
                    <Link to="/results">
                      <FileText size={15} />
                      View Report
                    </Link>
                    <Link to="/quiz">
                      <RotateCcw size={15} />
                      Retake
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <Disclaimer />
      </main>

      <BottomNav />
      <Footer />
    </>
  );
}

/* ==========================================================================
   Quiz / Assessment Flow
   ========================================================================== */

export function Quiz() {
  const nav = useNavigate();

  const [index, setIndex] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [answers, setAnswers] = useState(() =>
    JSON.parse(sessionStorage.getItem('wbc-answers') || '{}')
  );

  const question = questions[index];
  const selected = answers[question.id];

  useEffect(() => {
    sessionStorage.setItem('wbc-answers', JSON.stringify(answers));
  }, [answers]);

  // Keyboard navigation for 0-4 options
  useEffect(() => {
    function handleKeyDown(e) {
      const keyMap = { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4 };
      if (e.key in keyMap) {
        setAnswers((prev) => ({ ...prev, [question.id]: keyMap[e.key] }));
      } else if (e.key === 'Enter' && selected !== undefined) {
        next();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question.id, selected, index]);

  function confirmQuit() {
    sessionStorage.removeItem('wbc-answers');
    nav('/dashboard');
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      window.scrollTo(0, 0);
      return;
    }

    const total = Object.values(answers).reduce(
      (sum, value) => sum + value,
      0
    );

    const domainScores = {};
    domains.forEach((domain) => {
      domainScores[domain] = questions
        .filter((q) => q.domain === domain)
        .reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    });

    const result = {
      score: total,
      domainScores,
      date: new Date().toLocaleDateString('en-AU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    localStorage.setItem('wbc-latest', JSON.stringify(result));

    const history = storage.getHistory();
    localStorage.setItem(
      'wbc-history',
      JSON.stringify([
        {
          date: result.date,
          score: total,
          label: riskFor(total).label
        },
        ...history
      ])
    );

    sessionStorage.removeItem('wbc-answers');
    nav('/results');
  }

  const progressPercent = ((index + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <div className="shell">
          <Logo />

          <div className="quiz-meta-step">
            <strong>Question {index + 1} of {questions.length}</strong>
            <span>{question.domain}</span>
          </div>
        </div>
      </header>

      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <main className="quiz-main">
        <div className="quiz-prompt-wrap">
          <span className="domain-pill">{question.domain}</span>
          <h1>{question.text}</h1>
          <p>Over the past two weeks, choose the option that most accurately reflects your experience.</p>
        </div>

        <fieldset className="quiz-options-group">
          <legend className="sr-only">{question.text}</legend>

          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <label
                className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                key={option.value}
                onClick={() =>
                  setAnswers({ ...answers, [question.id]: option.value })
                }
              >
                <div className="quiz-option-left">
                  <span className="quiz-radio-indicator">
                    <span className="quiz-radio-dot" />
                  </span>
                  <span className="quiz-option-label">{option.label}</span>
                </div>

                <span className="quiz-option-shortcut">Key {option.value}</span>

                <input
                  type="radio"
                  name="quiz-answer"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() =>
                    setAnswers({ ...answers, [question.id]: option.value })
                  }
                />
              </label>
            );
          })}
        </fieldset>

        <div className="quiz-nav-row">
          <button
            type="button"
            className="button secondary"
            disabled={index === 0}
            onClick={() => {
              setIndex(index - 1);
              window.scrollTo(0, 0);
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            className="text-button"
            style={{ color: 'var(--text-tertiary)' }}
            onClick={() => setShowQuitModal(true)}
          >
            Quit Check-in
          </button>

          <button
            type="button"
            className="button large"
            disabled={selected === undefined}
            onClick={next}
          >
            {index === questions.length - 1 ? 'View My Report' : 'Next Question'}
            <ArrowRight size={18} />
          </button>
        </div>

        <Disclaimer />
      </main>

      {/* Quit Modal */}
      {showQuitModal && (
        <div className="quit-modal-overlay">
          <div className="quit-modal-card">
            <h3>Quit Assessment?</h3>
            <p>
              If you leave now, your current answers will not be saved. You can always start
              fresh whenever you are ready.
            </p>
            <div className="quit-modal-actions">
              <button
                type="button"
                className="button secondary small"
                onClick={() => setShowQuitModal(false)}
              >
                Continue Assessment
              </button>
              <button
                type="button"
                className="button small terracotta"
                onClick={confirmQuit}
              >
                Yes, Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Results Page (Wellbeing Snapshot Report)
   ========================================================================== */

export function Results() {
  const nav = useNavigate();

  const latest =
    JSON.parse(localStorage.getItem('wbc-latest') || 'null') || {
      score: 58,
      date: '02 May 2026',
      domainScores: {
        'Emotional Health': 12,
        'Stress & Anxiety': 15,
        'Sleep & Energy': 11,
        'Social Connection': 9,
        'Daily Functioning': 11
      }
    };

  const risk = riskFor(latest.score);

  const maxByDomain = {
    'Emotional Health': 24,
    'Stress & Anxiety': 24,
    'Sleep & Energy': 20,
    'Social Connection': 20,
    'Daily Functioning': 20
  };

  // Calculate circular stroke offset
  const circumference = 2 * Math.PI * 65; // ~408.4
  const strokePercent = (latest.score / 108) * circumference;
  const strokeOffset = circumference - strokePercent;

  function download() {
    const lines = [
      `==================================================`,
      ` WELLBEINGCHECK — CONFIDENTIAL SCREENING REPORT`,
      `==================================================`,
      `Date Completed: ${latest.date}`,
      `Overall Score:  ${latest.score} / 108`,
      `Status Tier:    ${risk.label}`,
      `Clinical Note:  ${risk.message}`,
      ``,
      `DOMAIN BREAKDOWN:`,
      `--------------------------------------------------`,
      ...domains.map((domain) => {
        const score = latest.domainScores[domain] ?? 0;
        const max = maxByDomain[domain];
        return `• ${domain.padEnd(20)}: ${score} / ${max} (${Math.round((score / max) * 100)}%)`;
      }),
      ``,
      `RECOMMENDED NEXT STEPS:`,
      `--------------------------------------------------`,
      `1. Review areas with higher relative scores.`,
      `2. Discuss any recurring fatigue or stress with a GP or qualified counselor.`,
      `3. Practice intentional micro-breaks and boundary setting during service.`,
      ``,
      `IMPORTANT NOTICE:`,
      `This report is an evidence-informed screening tool for self-reflection`,
      `and does NOT replace a clinical diagnosis by a healthcare practitioner.`,
      `==================================================`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WellBeingCheck-Report-${latest.date.replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="results-header">
        <div className="shell nav">
          <Logo />

          <div className="nav-actions">
            <button
              type="button"
              className="button secondary small"
              onClick={() => window.print()}
            >
              <Printer size={15} /> Print
            </button>
            <Link className="button subtle small" to="/dashboard">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="results-page shell">
        {/* Banner Title */}
        <div className="results-header-banner">
          <div className="results-title-group">
            <span className="eyebrow">
              <Sparkles size={15} /> Screening Complete
            </span>
            <h1>Your Wellbeing Snapshot</h1>
            <p>Assessment completed on {latest.date} · Private & confidential</p>
          </div>

          <div className="results-actions">
            <button className="button terracotta" onClick={download}>
              <Download size={16} /> Download Report (.txt)
            </button>
            <button className="button secondary" onClick={() => nav('/quiz')}>
              <RotateCcw size={16} /> Retake Check-in
            </button>
          </div>
        </div>

        {/* Main Summary Card */}
        <section className="results-summary-card">
          <div className="score-visual-col">
            <div className="score-visual-wheel">
              <svg viewBox="0 0 160 160">
                <circle
                  className="bg-ring"
                  cx="80"
                  cy="80"
                  r="65"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  className="score-ring-bar"
                  cx="80"
                  cy="80"
                  r="65"
                  strokeWidth="12"
                  fill="none"
                  stroke={
                    latest.score <= 35
                      ? 'var(--status-safe-text)'
                      : latest.score <= 70
                      ? 'var(--status-watch-text)'
                      : 'var(--status-risk-text)'
                  }
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                />
              </svg>
              <div className="score-wheel-text">
                <strong>{latest.score}</strong>
                <span>/ 108</span>
              </div>
            </div>

            <span className={`status ${risk.className}`}>
              {risk.label}
            </span>
          </div>

          <div className="results-narrative-col">
            <h2>Overall Result & Interpretation</h2>
            <p>{risk.message}</p>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
              Scores below 36 indicate balanced wellbeing, 36–70 suggest areas that may benefit from
              extra care or conversation, and 71+ suggest connecting with professional support soon.
            </p>
          </div>
        </section>

        {/* 5 Domain Breakdown Section */}
        <section className="domain-breakdown-section">
          <div>
            <h2>Domain Breakdown</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Detailed review of your responses across the five core dimensions of wellbeing:
            </p>
          </div>

          <div className="domain-bars-list">
            {domains.map((domain) => {
              const score = latest.domainScores[domain] ?? 0;
              const max = maxByDomain[domain];
              const pct = Math.round((score / max) * 100);

              let domainStatus = 'Balanced';
              let barColor = 'var(--brand-forest)';

              if (pct > 65) {
                domainStatus = 'Attention Recommended';
                barColor = 'var(--brand-terracotta)';
              } else if (pct > 35) {
                domainStatus = 'Moderate Concern';
                barColor = 'var(--brand-amber)';
              }

              return (
                <div className="domain-bar-row" key={domain}>
                  <div className="domain-bar-head">
                    <div>
                      <strong>{domain}</strong>
                      <span style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        ({domainStatus})
                      </span>
                    </div>
                    <span>
                      {score} / {max} ({pct}%)
                    </span>
                  </div>

                  <div className="domain-bar-track">
                    <div
                      className="domain-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: barColor
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Suggested Next Steps */}
        <section className="next-steps-section">
          <h2>Suggested Next Steps</h2>

          <div className="next-steps-list">
            <article className="next-step-card">
              <div className="next-step-icon">
                <Compass size={20} />
              </div>
              <div className="next-step-content">
                <h3>Personal Reflection</h3>
                <p>
                  Reflect on which routines or boundaries feel strained. Notice where you may be
                  over-committing energy without adequate replenishment.
                </p>
              </div>
            </article>

            <article className="next-step-card">
              <div className="next-step-icon">
                <HeartHandshake size={20} />
              </div>
              <div className="next-step-content">
                <h3>Share with Someone You Trust</h3>
                <p>
                  Speaking openly with a trusted peer, mentor, or family member can ease feelings of
                  isolation and provide supportive perspective.
                </p>
              </div>
            </article>

            <article className="next-step-card">
              <div className="next-step-icon">
                <Activity size={20} />
              </div>
              <div className="next-step-content">
                <h3>Consult a Professional</h3>
                <p>
                  If you notice persistent fatigue, low mood, or anxiety, schedule a conversation
                  with your GP or a qualified mental health practitioner.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Crisis Support Box */}
        <aside className="crisis-banner-box">
          <PhoneCall size={24} className="crisis-banner-icon" />
          <div className="crisis-banner-text">
            <h4>Immediate 24/7 Crisis Support</h4>
            <p>
              If you are feeling overwhelmed, distressed, or having thoughts of self-harm, please
              know you do not have to carry it alone. Reach out immediately to Lifeline (13 11 14)
              or call emergency services (000 / 911).
            </p>
          </div>
        </aside>

        <Disclaimer />
      </main>

      <Footer />
    </>
  );
}

/* ==========================================================================
   Static Pages: About Screening, FAQs, Privacy, Terms, 404
   ========================================================================== */

export function AboutScreening() {
  return (
    <>
      <PublicHeader />

      <main className="info-page shell">
        <div className="info-container">
          <span className="info-eyebrow">Screening Framework</span>
          <h1>About the WellBeingCheck Screening</h1>
          <p className="info-lead">
            WellBeingCheck is an evidence-informed self-reflection framework designed to empower
            individuals and caregivers to monitor their mental, emotional, and social health.
          </p>

          <section className="info-section">
            <h2>The Science Behind the 27 Questions</h2>
            <p>
              Our assessment draws from validated psychometric screening tools including standard
              measures for mood, generalized anxiety, sleep disruption, and social support. It
              condenses multi-dimensional indicators into a brief, non-intrusive 8-minute experience.
            </p>
          </section>

          <section className="info-section">
            <h2>The Five Dimensions</h2>
            <p>
              Wellbeing is dynamic and multifaceted. Rather than a binary "healthy / not healthy"
              label, our report breaks down Emotional Health, Stress & Anxiety, Sleep & Energy, Social
              Connection, and Daily Functioning.
            </p>
          </section>

          <section className="info-section">
            <h2>Confidentiality & Ethics</h2>
            <p>
              Self-reflection requires complete psychological safety. All demonstration results are
              kept client-side with zero data harvesting.
            </p>
          </section>

          <Disclaimer />
        </div>
      </main>

      <Footer />
    </>
  );
}

export function FAQs() {
  const faqItems = [
    {
      q: 'How long does the assessment take to complete?',
      a: 'The assessment contains 27 straightforward questions and typically takes about 6 to 8 minutes in a quiet setting.'
    },
    {
      q: 'Is WellBeingCheck a formal clinical diagnosis?',
      a: 'No. WellBeingCheck is an evidence-informed screening and awareness tool. It provides insight to encourage healthy habits or prompt a discussion with a qualified doctor or mental health professional.'
    },
    {
      q: 'Can I take the assessment multiple times?',
      a: 'Absolutely. We encourage taking the check-in every 2 to 4 weeks, or whenever you experience significant life or workplace transitions.'
    },
    {
      q: 'Where are my answers and results stored?',
      a: 'In this browser application, your answers and calculated reports are saved locally on your device. Your data is not sold or tracked by third parties.'
    },
    {
      q: 'Can I share or print my results?',
      a: 'Yes! On the results page, you can click "Download Report" to save a comprehensive text file, or click "Print" to print a clean summary for your doctor.'
    },
    {
      q: 'What should I do if my score indicates elevated risk?',
      a: 'Take a breath—an elevated score is an invitation to prioritize yourself. We provide practical guidance and recommend reaching out to your doctor or a free 24/7 hotline like Lifeline (13 11 14).'
    }
  ];

  return (
    <>
      <PublicHeader />

      <main className="info-page shell">
        <div className="info-container">
          <span className="info-eyebrow">Help & Guidance</span>
          <h1>Frequently Asked Questions</h1>
          <p className="info-lead">
            Common questions about WellBeingCheck, how results are calculated, and how to make the
            most of your screening report.
          </p>

          <div className="faq-list">
            {faqItems.map((item, idx) => (
              <details className="faq-item" key={item.q} open={idx === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>

          <Disclaimer />
        </div>
      </main>

      <Footer />
    </>
  );
}

export function PrivacyPolicy() {
  return (
    <>
      <PublicHeader />

      <main className="info-page shell">
        <div className="info-container">
          <span className="info-eyebrow">Trust & Transparency</span>
          <h1>Privacy Policy</h1>
          <p className="info-lead">
            We hold your privacy to the highest ethical standards. Learn how we safeguard your
            wellbeing data.
          </p>

          <section className="info-section">
            <h2>1. Information We Collect</h2>
            <p>
              We only process account credentials and wellbeing answers necessary to generate your
              self-reflection report.
            </p>
          </section>

          <section className="info-section">
            <h2>2. No Third-Party Tracking or Ads</h2>
            <p>
              We do not run ad networks, pixel trackers, or commercial data brokers. Your results
              are private to you.
            </p>
          </section>

          <section className="info-section">
            <h2>3. Local Device Storage</h2>
            <p>
              In this demonstration, your data remains safely in your local browser storage. You can
              clear your data at any time via your browser settings or by logging out.
            </p>
          </section>

          <Disclaimer />
        </div>
      </main>

      <Footer />
    </>
  );
}

export function Terms() {
  return (
    <>
      <PublicHeader />

      <main className="info-page shell">
        <div className="info-container">
          <span className="info-eyebrow">Legal Terms</span>
          <h1>Terms of Use</h1>
          <p className="info-lead">
            Please read these terms before engaging with the WellBeingCheck screening tool.
          </p>

          <section className="info-section">
            <h2>1. Not a Substitute for Medical Advice</h2>
            <p>
              WellBeingCheck is an educational self-reflection screening tool and does not constitute
              clinical diagnosis, psychotherapy, or medical prescription.
            </p>
          </section>

          <section className="info-section">
            <h2>2. Crisis Notice</h2>
            <p>
              If you or someone you know is in immediate life-threatening danger, contact your local
              emergency services (000 / 911) immediately.
            </p>
          </section>

          <section className="info-section">
            <h2>3. Acceptable Use</h2>
            <p>
              You agree to use this application for personal wellbeing self-reflection in a lawful
              and respectful manner.
            </p>
          </section>

          <Disclaimer />
        </div>
      </main>

      <Footer />
    </>
  );
}

export function NotFound() {
  return (
    <main className="not-found">
      <Logo />
      <h1 style={{ marginTop: '20px' }}>Page Not Found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link className="button large" to="/">
        Return to Home <ArrowRight size={18} />
      </Link>
    </main>
  );
}
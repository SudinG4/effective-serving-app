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
  assessmentSections,
  getAnswerLabel,
  initialHistory,
  isAnswerComplete,
  isQuestionVisible,
  questionnaireTitle,
  questionnaireVersion,
  questions,
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
                  <Clock3 size={16} /> 14 Sections (~10 min)
                </div>
                <div className="trust-badge">
                  <ShieldCheck size={16} /> Private & Confidential
                </div>
                <div className="trust-badge">
                  <FileText size={16} /> Private Response Summary
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="sample-card">
                <div className="sample-top">
                  <span className="sample-label">Sample Assessment Report</span>
                  <span className="status safe">Responses Recorded</span>
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
                      <span className="score-num">✓</span>
                      <span className="score-max">Complete</span>
                    </div>
                  </div>

                  <div className="sample-score-meta">
                    <h4>Private Response Summary</h4>
                    <p>Review your answers by section. Scoring is enabled only after company approval.</p>
                  </div>
                </div>

                <div className="sample-bars">
                  <div className="mini-row">
                    <span>General Wellbeing</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: '65%' }} />
                    </div>
                    <span className="bar-val">Recorded</span>
                  </div>

                  <div className="mini-row">
                    <span>Ministry Burnout</span>
                    <div className="bar-track">
                      <div className="bar-fill accent" style={{ width: '58%' }} />
                    </div>
                    <span className="bar-val">Recorded</span>
                  </div>

                  <div className="mini-row">
                    <span>Rest & Recovery</span>
                    <div className="bar-track">
                      <div className="bar-fill sage" style={{ width: '70%' }} />
                    </div>
                    <span className="bar-val">Recorded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Whole-person coverage */}
        <section className="domains-overview-section">
          <div className="shell">
            <div className="section-header">
              <span className="eyebrow">Comprehensive Coverage</span>
              <h2>Whole-person ministry wellbeing</h2>
              <p>
                The company questionnaire considers emotional, relational, spiritual and physical
                wellbeing alongside the particular pressures of ministry.
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
                Work through the official multi-section questionnaire, including rating scales,
                Yes/No items and reflective checklists.
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
  const latestLabel = history[0]
    ? history[0].completedCount !== undefined ? 'Completed' : 'Legacy'
    : 'Not started';

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
              Complete the Centre for Effective Serving’s multi-section emotional health check for
              ministry workers. It takes about 10 minutes and records a private response summary.
            </p>

            <div className="quick-facts">
              <span><Layers size={15} /> 14 Sections</span>
              <span><Clock3 size={15} /> ~10 Minutes</span>
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
              <span className="status safe">
                {latestLabel}
              </span>
            </span>
            <span className="stat-card-sub">Completed on {history[0]?.date || 'Recent'}</span>
          </article>

          <article className="stat-card">
            <span className="stat-card-title">Check-in Cadence</span>
            <span className="stat-card-value">
              {history.length > 0 ? 'Active' : 'Ready'}
            </span>
            <span className="stat-card-sub">Recommended every 2–4 weeks</span>
          </article>
        </section>

        {/* History List */}
        <section className="history-section">
          <div className="history-header">
            <div>
              <h2>Past Assessment History</h2>
              <p>Review completed company questionnaires stored on this device.</p>
            </div>
            <Link className="button small subtle" to="/quiz">
              + New Check-in
            </Link>
          </div>

          <div className="history-list">
            {history.map((item, index) => {
              return (
                <article className="history-row" key={item.date + index}>
                  <div>
                    <span className="history-date">{item.date}</span>
                  </div>

                  <div>
                    <span className="history-score">
                      {item.completedCount ?? '—'} <small>responses</small>
                    </span>
                  </div>

                  <div>
                    <span className="status safe">
                      {item.completedCount !== undefined ? 'Completed' : 'Legacy'}
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

  const visibleQuestions = questions.filter((item) => isQuestionVisible(item, answers));
  const question = visibleQuestions[index];
  const selected = answers[question.id];
  const answerComplete = isAnswerComplete(question, selected);

  useEffect(() => {
    sessionStorage.setItem('wbc-answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setShowQuitModal(true);
      } else if (e.key === 'Enter' && answerComplete && question.type !== 'text' && question.type !== 'email') {
        next();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question.id, answerComplete, index]);

  useEffect(() => {
    if (index > visibleQuestions.length - 1) {
      setIndex(Math.max(visibleQuestions.length - 1, 0));
    }
  }, [index, visibleQuestions.length]);

  function confirmQuit() {
    sessionStorage.removeItem('wbc-answers');
    nav('/dashboard');
  }

  function next() {
    if (index < visibleQuestions.length - 1) {
      setIndex(index + 1);
      window.scrollTo(0, 0);
      return;
    }

    const result = {
      questionnaire: questionnaireTitle,
      version: questionnaireVersion,
      answers,
      completedCount: visibleQuestions.filter((item) =>
        isAnswerComplete(item, answers[item.id])
      ).length,
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
          completedCount: result.completedCount,
          label: 'Completed'
        },
        ...history
      ])
    );

    sessionStorage.removeItem('wbc-answers');
    nav('/results');
  }

  const progressPercent = ((index + 1) / visibleQuestions.length) * 100;

  function selectRadio(value) {
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
  }

  function toggleCheckbox(value) {
    setAnswers((previous) => {
      const current = Array.isArray(previous[question.id]) ? previous[question.id] : [];
      let nextValues;

      if (question.exclusiveOption && value === question.exclusiveOption) {
        nextValues = current.includes(value) ? [] : [value];
      } else {
        const withoutExclusive = question.exclusiveOption
          ? current.filter((item) => item !== question.exclusiveOption)
          : current;
        nextValues = withoutExclusive.includes(value)
          ? withoutExclusive.filter((item) => item !== value)
          : [...withoutExclusive, value];
      }

      return { ...previous, [question.id]: nextValues };
    });
  }

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <div className="shell">
          <Logo />

          <div className="quiz-meta-step">
            <strong>Item {index + 1} of {visibleQuestions.length}</strong>
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
          <p>{question.prompt || (question.required === false
            ? 'This item is optional. Choose any relevant answer or continue.'
            : 'Choose the response that best reflects your experience.')}</p>
        </div>

        <fieldset className="quiz-options-group">
          <legend className="sr-only">{question.text}</legend>

          {(question.type === 'text' || question.type === 'email') && (
            <label className="quiz-text-field">
              <span>{question.type === 'email' ? 'Email address' : 'Your response'}</span>
              <input
                type={question.type}
                value={selected || ''}
                placeholder={question.placeholder || ''}
                onChange={(event) =>
                  setAnswers({ ...answers, [question.id]: event.target.value })
                }
                autoFocus
              />
            </label>
          )}

          {question.type === 'radio' && question.options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <label className={`quiz-option-card ${isSelected ? 'selected' : ''}`} key={option.value}>
                <div className="quiz-option-left">
                  <span className="quiz-radio-indicator"><span className="quiz-radio-dot" /></span>
                  <span className="quiz-option-label">{option.label}</span>
                </div>
                <input
                  type="radio"
                  name={`quiz-answer-${question.id}`}
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => selectRadio(option.value)}
                />
              </label>
            );
          })}

          {question.type === 'checkbox' && question.options.map((option) => {
            const checked = Array.isArray(selected) && selected.includes(option.value);
            return (
              <label className={`quiz-option-card ${checked ? 'selected' : ''}`} key={option.value}>
                <div className="quiz-option-left">
                  <span className="quiz-checkbox-indicator">{checked && <CheckCircle2 size={16} />}</span>
                  <span className="quiz-option-label">{option.label}</span>
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleCheckbox(option.value)}
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
            disabled={!answerComplete}
            onClick={next}
          >
            {index === visibleQuestions.length - 1 ? 'View Response Summary' : 'Next'}
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
      questionnaire: questionnaireTitle,
      version: questionnaireVersion,
      date: 'Not yet completed',
      answers: {},
      completedCount: 0
    };

  const resultSections = assessmentSections.filter(
    (section) => section.category === 'assessment'
  );

  function download() {
    const lines = [
      `==================================================`,
      ` TUNE IN — PRIVATE RESPONSE SUMMARY`,
      `==================================================`,
      `Date Completed: ${latest.date}`,
      `Questionnaire:  ${latest.questionnaire || questionnaireTitle}`,
      `Version:        ${latest.version || questionnaireVersion}`,
      ``,
      `IMPORTANT SCORING NOTE:`,
      `--------------------------------------------------`,
      `This prototype records responses but does not calculate a clinical`,
      `score. Official company-approved scoring rules must be implemented`,
      `before automated interpretation is enabled.`,
      ``,
      ...resultSections.flatMap((section) => [
        section.title.toUpperCase(),
        `--------------------------------------------------`,
        ...section.questions.map((question) =>
          `• ${question.text}\n  ${getAnswerLabel(question, latest.answers?.[question.id])}`
        ),
        ``
      ]),
      `This response summary is for self-reflection and is not a diagnosis.`,
      `==================================================`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tune-In-Response-Summary-${latest.date.replace(/\s+/g, '-')}.txt`;
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
            <h1>Your Response Summary</h1>
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

        {/* Completion Summary */}
        <section className="results-summary-card">
          <div className="score-visual-col">
            <div className="completion-mark" aria-hidden="true">
              <CheckCircle2 size={64} />
            </div>
            <span className="status safe">Completed</span>
          </div>

          <div className="results-narrative-col">
            <h2>Your responses have been recorded</h2>
            <p>
              This prototype provides a private response summary for the official company
              questionnaire. It does not currently calculate or interpret a clinical score.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
              Company-approved scoring formulas must be supplied and reviewed before automated
              results or risk labels are enabled.
            </p>
          </div>
        </section>

        {/* Response Summary */}
        <section className="domain-breakdown-section">
          <div>
            <h2>Response Summary</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Review the responses recorded for each company questionnaire section.
            </p>
          </div>

          <div className="response-sections-list">
            {resultSections.map((section) => (
              <details className="response-section" key={section.id}>
                <summary>{section.title}</summary>
                <div className="response-items">
                  {section.questions.map((question) => (
                    <div className="response-item" key={question.id}>
                      <strong>{question.text}</strong>
                      <span>{getAnswerLabel(question, latest.answers?.[question.id])}</span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
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
            <h2>The Company Questionnaire</h2>
            <p>
              This prototype presents the Centre for Effective Serving’s Tune In Emotional Health
              Check for ministry workers. It covers general wellbeing, attention, mood, anxiety,
              burnout, rest, spiritual wellbeing, support, relationships and physical wellbeing.
            </p>
          </section>

          <section className="info-section">
            <h2>Whole-Person Coverage</h2>
            <p>
              Wellbeing is dynamic and multifaceted. The company questionnaire considers general
              wellbeing, attention, mood, anxiety, burnout, rest, spirituality, support,
              relationships and physical wellbeing.
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
      a: 'The company questionnaire contains 14 main sections and typically takes about 10 minutes in a quiet setting.'
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
      a: 'In this browser application, your answers and response summaries are saved locally on your device. Your data is not sold or tracked by third parties.'
    },
    {
      q: 'Can I share or print my results?',
      a: 'Yes! On the results page, you can click "Download Report" to save a comprehensive text file, or click "Print" to print a clean summary for your doctor.'
    },
    {
      q: 'Why does the prototype not show a clinical score?',
      a: 'The official company scoring formulas were not included with the questionnaire. The prototype records a private response summary and will only calculate results after approved scoring rules are supplied.'
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
            Common questions about WellBeingCheck, the company questionnaire, and your private
            response summary.
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

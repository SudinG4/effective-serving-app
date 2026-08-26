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
  X
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

const storage = {
  getUser: () =>
    JSON.parse(localStorage.getItem('wbc-user') || 'null'),

  setUser: (user) =>
    localStorage.setItem('wbc-user', JSON.stringify(user)),

  removeUser: () =>
    localStorage.removeItem('wbc-user'),

  getAccount: () =>
    JSON.parse(localStorage.getItem('wbc-account') || 'null'),

  setAccount: (account) =>
    localStorage.setItem('wbc-account', JSON.stringify(account)),

  getHistory: () =>
    JSON.parse(
      localStorage.getItem('wbc-history') ||
      JSON.stringify(initialHistory)
    )
};

export function Home() {
  return (
    <>
      <PublicHeader />

      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={16} />
              Evidence-informed wellbeing screening
            </span>

            <h1>Understand Your Wellbeing — Clearly</h1>

            <p className="lead">
              A 27-point self-assessment across five domains. Answer honestly
              and get an instant, private report that helps guide your next
              step.
            </p>

            <div className="hero-actions">
              <Link className="button" to="/signup">
                Get Started <ArrowRight size={18} />
              </Link>

              <Link className="button secondary" to="/login">
                Log In
              </Link>
            </div>

            <p className="micro">
              Takes about 8 minutes. No diagnosis — a screen to guide your
              next step.
            </p>
          </div>

          <div className="sample-card">
            <div className="sample-top">
              <span>Sample result</span>
              <span className="status safe">Screening complete</span>
            </div>

            <div className="score-ring">
              <strong>58</strong>
              <span>/ 108</span>
            </div>

            {[
              'Emotional Health',
              'Stress & Anxiety',
              'Sleep & Energy'
            ].map((item, index) => (
              <div className="mini-row" key={item}>
                <span>{item}</span>

                <div>
                  <i
                    style={{
                      width: `${[68, 51, 76][index]}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="features shell">
          {featureData.map(([Icon, title, text]) => (
            <article key={title}>
              <span className="icon">
                <Icon />
              </span>

              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="cta shell">
          <h2>Ready to check in with yourself?</h2>

          <p>
            It only takes a few minutes, and what you learn is yours to keep.
          </p>

          <Link className="button light" to="/quiz">
            Start Assessment <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

function AuthShell({ signup = false }) {
  const nav = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    setError('');

    if (signup) {
      if (form.firstName.trim().length < 2) {
        setError('Please enter your first name.');
        return;
      }

      if (form.lastName.trim().length < 2) {
        setError('Please enter your last name.');
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(form.email)) {
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

      const account = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password
      };

      storage.setAccount(account);

      storage.setUser({
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phone: account.phone
      });

      nav('/dashboard');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    const account = storage.getAccount();

    if (!account) {
      setError('No account found. Please sign up first.');
      return;
    }

    if (
      account.email !== form.email.trim().toLowerCase() ||
      account.password !== form.password
    ) {
      setError('Incorrect email or password.');
      return;
    }

    storage.setUser({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      phone: account.phone
    });

    nav('/dashboard');
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Logo />
      </header>

      <main className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <span className="auth-icon">
            <HeartPulse />
          </span>

          <h1>{signup ? 'Create your account' : 'Welcome back'}</h1>

          <p>
            {signup
              ? 'Begin your private wellbeing check.'
              : 'Log in to continue your wellbeing screening.'}
          </p>

          {signup && (
            <>
              <label>
                First name
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      firstName: e.target.value
                    })
                  }
                  placeholder="First name"
                  autoComplete="given-name"
                />
              </label>

              <label>
                Last name
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lastName: e.target.value
                    })
                  }
                  placeholder="Last name"
                  autoComplete="family-name"
                />
              </label>

              <label>
                Contact number
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                  }
                  placeholder="04XX XXX XXX"
                  autoComplete="tel"
                />
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              placeholder="••••••••"
              autoComplete={
                signup ? 'new-password' : 'current-password'
              }
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="button full" type="submit">
            {signup ? 'Create Account' : 'Continue'}
            <ArrowRight size={18} />
          </button>

          <p className="switch">
            {signup
              ? 'Already have an account?'
              : 'Don’t have an account?'}

            {' '}

            <Link to={signup ? '/login' : '/signup'}>
              {signup ? 'Log in' : 'Sign up'}
            </Link>
          </p>

          <p className="prototype">
            Prototype only — account information is stored locally in this
            browser.
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

export function Dashboard() {
  const nav = useNavigate();
  const user = storage.getUser();
  const history = storage.getHistory();

  function logout() {
    storage.removeUser();
    nav('/login');
  }

  return (
    <>
      <header className="dashboard-header">
        <div className="shell dash-head">
          <Logo />

          <div className="welcome">
            <h1>Good day, {user?.firstName || 'there'}</h1>
            <p>Your private wellbeing dashboard</p>
          </div>

          <div className="utility">
            <button aria-label="Notifications">
              <Bell />
            </button>

            <button aria-label="Help">
              <CircleHelp />
            </button>

            <button aria-label="Settings">
              <Settings />
            </button>

            <button onClick={logout} aria-label="Logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard shell">
        <section className="start-card">
          <div>
            <span className="eyebrow">
              <Sparkles size={16} />
              A moment for you
            </span>

            <h2>Start Assessment</h2>

            <p>
              27 questions across 5 domains, about 8 minutes. You’ll get an
              instant report at the end.
            </p>

            <div className="quick-facts">
              <span>
                <UsersRound />
                5 domains
              </span>

              <span>
                <Clock3 />
                ~8 min
              </span>

              <span>
                <FileText />
                Instant report
              </span>
            </div>
          </div>

          <Link className="button" to="/quiz">
            Start Assessment <ArrowRight />
          </Link>
        </section>

        <section className="stats">
          <article>
            <strong>{history.length}</strong>
            <span>Assessments Taken</span>
          </article>

          <article>
            <strong>{Math.max(history.length - 1, 0)}</strong>
            <span>Reports Viewed</span>
          </article>

          <article>
            <strong>
              {history.length > 1 &&
              history[0].score < history[1].score
                ? 'Improving'
                : 'Keep checking in'}
            </strong>

            <span>Current Trend</span>
          </article>
        </section>

        <section className="history">
          <div className="section-title">
            <div>
              <h2>Past Results</h2>
              <p>Your previous screenings and reports.</p>
            </div>
          </div>

          <div className="result-list">
            {history.map((item, index) => {
              const risk = riskFor(item.score);

              return (
                <article key={item.date + index}>
                  <div>
                    <span className="date">{item.date}</span>

                    <strong>
                      {item.score}
                      <small>/ 108</small>
                    </strong>
                  </div>

                  <span className={`status ${risk.className}`}>
                    {item.label}
                  </span>

                  <div className="row-actions">
                    <Link to="/results">View Report</Link>

                    <Link to="/quiz">
                      <RotateCcw />
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

export function Quiz() {
  const nav = useNavigate();
  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState(() =>
    JSON.parse(sessionStorage.getItem('wbc-answers') || '{}')
  );

  const question = questions[index];
  const selected = answers[question.id];

  function quitAssessment() {
    const confirmQuit = window.confirm(
      'Are you sure you want to quit the assessment? Your current answers will not be saved.'
    );

    if (!confirmQuit) {
      return;
    }

    sessionStorage.removeItem('wbc-answers');
    nav('/dashboard');
  }

  useEffect(() => {
    sessionStorage.setItem(
      'wbc-answers',
      JSON.stringify(answers)
    );
  }, [answers]);

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
        .filter((question) => question.domain === domain)
        .reduce(
          (sum, question) =>
            sum + (answers[question.id] ?? 0),
          0
        );
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

    localStorage.setItem(
      'wbc-latest',
      JSON.stringify(result)
    );

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

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <Logo />

        <div>
          <strong>
            Question {index + 1} of {questions.length}
          </strong>

          <span>{question.domain}</span>
        </div>
      </header>

      <div className="progress">
        <i
          style={{
            width: `${((index + 1) / questions.length) * 100}%`
          }}
        />
      </div>

      <main className="quiz-main">
        <span className="domain-pill">
          {question.domain}
        </span>

        <h1>{question.text}</h1>

        <p>
          Choose the option that best describes your experience.
        </p>

        <fieldset>
          <legend className="sr-only">
            {question.text}
          </legend>

          {options.map((option) => (
            <label
              className={
                selected === option.value ? 'selected' : ''
              }
              key={option.value}
            >
              <input
                type="radio"
                name="answer"
                checked={selected === option.value}
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [question.id]: option.value
                  })
                }
              />

              <span className="radio-dot" />
              <span>{option.label}</span>
              <b>{option.value}</b>
            </label>
          ))}
        </fieldset>

        <div className="quiz-actions">
          <button
            className="button secondary"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
            type="button"
          >
            <ArrowLeft />
            Back
          </button>

          <button
            className="button secondary quit-button"
            onClick={quitAssessment}
            type="button"
          >
            <X size={18} />
            Quit Assessment
          </button>

          <button
            className="button"
            disabled={selected === undefined}
            onClick={next}
            type="button"
          >
            {index === questions.length - 1
              ? 'See My Results'
              : 'Next'}

            <ArrowRight />
          </button>
        </div>

        <Disclaimer />
      </main>
    </div>
  );
}

export function Results() {
  const nav = useNavigate();

  const latest =
    JSON.parse(
      localStorage.getItem('wbc-latest') || 'null'
    ) || {
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

  function download() {
    const lines = [
      `WellBeingCheck Report — ${latest.date}`,
      `Total score: ${latest.score} / 108`,
      `Guidance: ${risk.label}`,
      '',
      ...domains.map(
        (domain) =>
          `${domain}: ${
            latest.domainScores[domain] ?? 0
          } / ${maxByDomain[domain]}`
      ),
      '',
      'This is a screening result, not a medical diagnosis.'
    ];

    const blob = new Blob(
      [lines.join('\n')],
      {
        type: 'text/plain'
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'wellbeingcheck-report.txt';

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="results-header">
        <div className="shell nav">
          <Logo />

          <Link
            className="button secondary small"
            to="/dashboard"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="results shell">
        <div className="results-title">
          <span className="eyebrow">
            <Sparkles />
            Screening complete
          </span>

          <h1>Your wellbeing snapshot</h1>

          <p>Completed {latest.date}</p>
        </div>

        <section className="result-summary">
          <div className="big-score">
            <strong>{latest.score}</strong>
            <span>/ 108</span>
          </div>

          <div>
            <span className={`status ${risk.className}`}>
              {risk.label}
            </span>

            <h2>Your overall result</h2>

            <p>{risk.message}</p>
          </div>
        </section>

        <section className="domain-section">
          <h2>Your five domains</h2>

          {domains.map((domain) => {
            const score =
              latest.domainScores[domain] ?? 0;

            const max =
              maxByDomain[domain];

            return (
              <article key={domain}>
                <div>
                  <strong>{domain}</strong>
                  <span>
                    {score} / {max}
                  </span>
                </div>

                <div className="domain-bar">
                  <i
                    style={{
                      width: `${(score / max) * 100}%`
                    }}
                  />
                </div>
              </article>
            );
          })}
        </section>

        <section className="next-steps">
          <h2>Suggested next steps</h2>

          <ol>
            <li>
              Reflect on the areas with the highest scores.
            </li>

            <li>
              Share your concerns with someone you trust.
            </li>

            <li>
              Speak with a GP or qualified mental health
              professional if symptoms continue or affect
              daily life.
            </li>
          </ol>
        </section>

        <div className="results-actions">
          <button
            className="button"
            onClick={download}
          >
            <Download />
            Download Report
          </button>

          <button
            className="button secondary"
            onClick={() => nav('/quiz')}
          >
            <RotateCcw />
            Retake Assessment
          </button>
        </div>

        <Disclaimer />
      </main>

      <Footer />
    </>
  );
}

export function NotFound() {
  return (
    <main className="not-found">
      <Logo />

      <h1>Page not found</h1>

      <p>
        The page you requested does not exist.
      </p>

      <Link className="button" to="/">
        Return Home
      </Link>
    </main>
  );
}
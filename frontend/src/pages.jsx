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

    // Remove the old prototype account record if it exists.
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

export function Home() {
  return (
    <>
      <PublicHeader />

      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={16} />
              Trauma-informed wellbeing
            </span>

            <h1>Check Your Wellbeing</h1>

            <p className="lead">
              A wellbeing check designed to help you understand how you're doing,
              recognise areas of concern, and identify where support may be
              helpful.
            </p>

            <div className="hero-actions">
              <Link className="button" to="/signup">
                Start Assessment <ArrowRight size={18} />
              </Link>
            </div>

            <p className="micro">
              27 questions · About 8 minutes · Private results
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

            {['Emotional Health', 'Stress & Anxiety', 'Sleep & Energy'].map(
              (x, i) => (
                <div className="mini-row" key={x}>
                  <span>{x}</span>
                  <div>
                    <i style={{ width: `${[68, 51, 76][i]}%` }} />
                  </div>
                </div>
              )
            )}
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
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

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
          'Account created. Check your email and confirm your account, then log in.'
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          {status && (
            <p className="prototype">
              {status}
            </p>
          )}

          <button
            className="button full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? signup
                ? 'Creating Account...'
                : 'Logging In...'
              : signup
                ? 'Create Account'
                : 'Continue'}
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
            Authentication is handled by Supabase. Assessment
            results are still stored locally in this browser demo.
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
    storage.clearAuth();
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

export function AboutScreening() {

  return (

    <>

      <PublicHeader />

      <main className="info-page">

        <div className="info-container">

          <p className="info-eyebrow">Resources</p>

          <h1>About screening</h1>

          <p className="info-lead">

            WellBeingCheck is designed to help you reflect on your current

            wellbeing and understand how you have been tracking across several

            areas of everyday life.

          </p>

          <section className="info-section">

            <h2>What is wellbeing screening?</h2>

            <p>

              Wellbeing screening uses a structured set of questions to help

              identify patterns in areas such as mood, stress, everyday

              functioning and emotional wellbeing.

            </p>

          </section>

          <section className="info-section">

            <h2>What does the assessment do?</h2>

            <p>

              The assessment asks you a series of questions and provides a

              summary based on your responses. The result is intended to

              support reflection and awareness rather than provide a clinical

              diagnosis.

            </p>

          </section>

          <section className="info-section">

            <h2>What areas are assessed?</h2>

            <p>

              WellBeingCheck looks at multiple areas of wellbeing to give you

              a broader picture of how you may currently be tracking.

            </p>

          </section>

          <section className="info-section">

            <h2>Who is it for?</h2>

            <p>

              The tool is intended for people who want a simple way to check

              in with themselves and better understand their current

              wellbeing.

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

  const questions = [

    {

      question: 'How long does the assessment take?',

      answer:

        'The assessment is designed to take only a few minutes to complete.'

    },

    {

      question: 'Is WellBeingCheck a medical diagnosis?',

      answer:

        'No. WellBeingCheck is a screening and self-reflection tool. It does not provide a medical diagnosis.'

    },

    {

      question: 'Can I take the assessment again?',

      answer:

        'Yes. You can complete another assessment whenever you want to check in with your wellbeing again.'

    },

    {

      question: 'Where are my results stored?',

      answer:

        'Authentication is handled through Supabase. Assessment results in this demonstration are still stored locally in your browser.'

    },

    {

      question: 'Can other people see my results?',

      answer:

        'This demo is designed to keep your information within the browser you are using. However, it should not be treated as a production-grade system for storing sensitive information.'

    },

    {

      question: 'What should I do if I am worried about my results?',

      answer:

        'Consider discussing your concerns with a qualified health professional. If you are in immediate danger, contact your local emergency service.'

    }

  ];

  return (

    <>

      <PublicHeader />

      <main className="info-page">

        <div className="info-container">

          <p className="info-eyebrow">Resources</p>

          <h1>Frequently asked questions</h1>

          <p className="info-lead">

            Find answers to common questions about WellBeingCheck and how the

            assessment works.

          </p>

          <div className="faq-list">

            {questions.map(({ question, answer }) => (

              <details className="faq-item" key={question}>

                <summary>{question}</summary>

                <p>{answer}</p>

              </details>

            ))}

          </div>

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

      <main className="info-page">

        <div className="info-container">

          <p className="info-eyebrow">Legal</p>

          <h1>Privacy policy</h1>

          <p className="info-updated">Last updated: August 2026</p>

          <p className="info-lead">

            This page explains how information used by the WellBeingCheck

            demonstration application is handled.

          </p>

          <section className="info-section">

            <h2>Information we use</h2>

            <p>

              WellBeingCheck may use information you provide when creating an

              account and completing wellbeing assessments. This can include

              basic account information and your assessment responses.

            </p>

          </section>

          <section className="info-section">

            <h2>How information is used</h2>

            <p>

              Information is used to provide application functionality,

              calculate assessment results and display wellbeing information

              back to you.

            </p>

          </section>

          <section className="info-section">

            <h2>Local browser storage</h2>

            <p>

              This demonstration currently stores assessment information in your browser
              using local storage. Authentication is handled through Supabase,
              while local storage allows assessment results to remain available
              between pages and browser sessions.

            </p>

          </section>

          <section className="info-section">

            <h2>Sensitive information</h2>

            <p>

              This demonstration should not be treated as a production-grade

              platform for collecting or storing sensitive health information.

              A real-world system would require stronger security, privacy and

              data-governance controls.

            </p>

          </section>

          <section className="info-section">

            <h2>Data sharing</h2>

            <p>

              The current browser-based demonstration is not designed to sell

              or share assessment responses with third parties.

            </p>

          </section>

          <section className="info-section">

            <h2>Demonstration notice</h2>

            <p>

              This privacy policy is included for demonstration purposes and

              should not be considered a professionally reviewed privacy policy

              for a production healthcare service.

            </p>

          </section>

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

      <main className="info-page">

        <div className="info-container">

          <p className="info-eyebrow">Legal</p>

          <h1>Terms of use</h1>

          <p className="info-updated">Last updated: August 2026</p>

          <p className="info-lead">

            These terms describe the intended use and limitations of the

            WellBeingCheck demonstration application.

          </p>

          <section className="info-section">

            <h2>Purpose of WellBeingCheck</h2>

            <p>

              WellBeingCheck provides general wellbeing screening and

              informational feedback to support personal reflection.

            </p>

          </section>

          <section className="info-section">

            <h2>Not medical advice</h2>

            <p>

              Assessment results and information provided by WellBeingCheck do

              not constitute medical advice, diagnosis or treatment.

            </p>

          </section>

          <section className="info-section">

            <h2>No emergency services</h2>

            <p>

              WellBeingCheck is not an emergency or crisis service. If you are

              in immediate danger or require urgent assistance, contact your

              local emergency service.

            </p>

          </section>

          <section className="info-section">

            <h2>Responsible use</h2>

            <p>

              You should use the application only for its intended purpose and

              should not attempt to interfere with, damage, misuse or disrupt

              the application or its functionality.

            </p>

          </section>

          <section className="info-section">

            <h2>Accuracy and limitations</h2>

            <p>

              The results produced by this demonstration depend on the

              responses provided and are intended only as general wellbeing

              guidance. They should not replace professional assessment.

            </p>

          </section>

          <section className="info-section">

            <h2>Demonstration application</h2>

            <p>

              WellBeingCheck is currently presented as a demonstration

              application. Features, data-handling practices and functionality

              may change during development.

            </p>

          </section>

        </div>

      </main>

      <Footer />

    </>

  );

}
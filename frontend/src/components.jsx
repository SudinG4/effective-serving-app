import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  HeartPulse,
  ShieldCheck,
  FileText,
  ListChecks,
  ChartNoAxesCombined,
  House,
  ClipboardList,
  UserRound,
  TriangleAlert,
  X,
  PhoneCall,
  Sparkles,
  ArrowRight,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

export function Logo() {
  return (
    <Link className="logo" to="/" aria-label="WellBeingCheck home">
      <span className="logo-mark">
        <HeartPulse size={22} strokeWidth={2.2} />
      </span>
      <div className="logo-text">
        <span className="logo-title">WellBeingCheck</span>
        <span className="logo-subtitle">Evidence-Informed</span>
      </div>
    </Link>
  );
}

export function PublicHeader() {
  const user = JSON.parse(localStorage.getItem('wbc-user') || 'null');

  return (
    <header className="public-header">
      <div className="shell nav">
        <Logo />

        <nav className="nav-links" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/about-screening"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Screening Info
          </NavLink>
          <NavLink
            to="/faqs"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            FAQs
          </NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <Link className="button small subtle" to="/dashboard">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Log In
              </Link>
              <Link className="button small" to="/signup">
                Start Screening <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const resourceContent = {
  about: {
    title: 'About Screening & Methodology',
    content: (
      <>
        <p>
          WellBeingCheck is a trauma-informed, evidence-informed self-reflection
          tool crafted to give caregivers, helpers, and individuals a safe space
          to understand how they are tracking across core areas of life.
        </p>

        <h3>What is wellbeing screening?</h3>
        <p>
          Wellbeing screening uses structured, validated self-report questions to
          spot early patterns in mood, stress, daily functioning, sleep, and
          interpersonal connection before mild strain develops into burnout or crisis.
        </p>

        <h3>Is this a medical or clinical diagnosis?</h3>
        <p>
          No. WellBeingCheck does not provide medical diagnoses or replace
          consultation with qualified healthcare practitioners, GPs, or licensed psychologists.
          It is designed for clarity, insight, and guiding early support.
        </p>

        <h3>Who is this designed for?</h3>
        <p>
          It is specifically tailored for anyone in high-care roles, frontline service,
          caregiving, or individuals seeking private, proactive insight into their mental
          and emotional health.
        </p>
      </>
    )
  },

  faq: {
    title: 'Frequently Asked Questions',
    content: (
      <div className="modal-faq-list">
        <details open>
          <summary>How long does the assessment take?</summary>
          <p>
            The company questionnaire contains 14 main sections and typically
            takes about 10 minutes to complete in a calm environment.
          </p>
        </details>

        <details>
          <summary>Is my data kept private and confidential?</summary>
          <p>
            Yes. In this browser demonstration, all your answers and results remain strictly
            stored on your local device. We do not sell or track your responses.
          </p>
        </details>

        <details>
          <summary>How often should I take the screening?</summary>
          <p>
            We recommend checking in every two to four weeks, or whenever you feel your
            stress, workload, or life circumstances shifting.
          </p>
        </details>

        <details>
          <summary>Can I download and share my summary report?</summary>
          <p>
            Yes. Upon completing your assessment, you receive a private response summary that
            you can download or discuss with a trusted support person or healthcare professional.
          </p>
        </details>

        <details>
          <summary>Why does the prototype not show a clinical score?</summary>
          <p>
            The official company scoring formulas were not included with the questionnaire.
            This prototype records a response summary and will only calculate results after
            company-approved scoring rules are supplied.
          </p>
        </details>
      </div>
    )
  },

  privacy: {
    title: 'Privacy & Data Protection Policy',
    content: (
      <>
        <p className="modal-updated">Last revised: August 2026</p>

        <h3>Our Commitment to Your Privacy</h3>
        <p>
          We believe mental wellbeing information is deeply personal. WellBeingCheck
          is designed around privacy-first principles with zero third-party behavioral trackers.
        </p>

        <h3>Information We Process</h3>
        <p>
          When you use this demonstration, your responses, domain calculations, and profile
          details are held in secure client-side storage within your active browser session.
        </p>

        <h3>No Commercial Data Sharing</h3>
        <p>
          We do not sell, rent, or trade personal wellbeing data to data brokers, advertisers,
          or third parties under any circumstances.
        </p>

        <h3>Demonstration & Research Notice</h3>
        <p>
          This application serves as an evidence-informed demonstration platform. In a production
          clinical deployment, end-to-end encryption and HIPAA/Australian Privacy Principle (APP)
          compliant healthcare data vaults are utilized.
        </p>
      </>
    )
  },

  terms: {
    title: 'Terms of Use & Clinical Disclaimer',
    content: (
      <>
        <p className="modal-updated">Last revised: August 2026</p>

        <h3>Purpose of WellBeingCheck</h3>
        <p>
          WellBeingCheck provides educational screening and self-reflection guidance to foster
          proactive wellbeing awareness.
        </p>

        <h3>Not Medical or Emergency Care</h3>
        <p>
          Information provided by this application does not constitute medical advice, diagnosis,
          or clinical treatment. If you are in immediate distress or facing a mental health crisis,
          contact emergency services (000 in Australia, 911 in the US, 999 in the UK) or Lifeline.
        </p>

        <h3>Responsible Use</h3>
        <p>
          By using this service, you agree to engage with the tool for its intended personal
          wellbeing screening purposes and provide truthful self-reflection responses.
        </p>
      </>
    )
  }
};

export function ResourceModal({ resource, onClose }) {
  const selected = resourceContent[resource];

  useEffect(() => {
    if (!selected) return;

    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleEscape);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('modal-open');
    };
  }, [selected, onClose]);

  if (!selected) return null;

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="resource-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resource-modal-title"
      >
        <div className="resource-modal-header">
          <div>
            <span className="modal-label">WellBeingCheck Resource</span>
            <h2 id="resource-modal-title">{selected.title}</h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="resource-modal-content">
          {selected.content}
        </div>

        <div className="resource-modal-footer">
          <p>Evidence-informed screening · Not a medical diagnosis</p>

          <button
            type="button"
            className="button small secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export function Footer() {
  const [activeResource, setActiveResource] = useState(null);

  return (
    <>
      <footer>
        <div className="shell footer-grid">
          <div>
            <Logo />
            <p className="footer-about">
              A respectful, trauma-informed wellbeing check giving people who care
              and serve clear, confidential insight into how they are doing.
            </p>
          </div>

          <div>
            <h3>Navigation</h3>
            <div className="footer-col-links">
              <Link className="footer-product-link" to="/">Home</Link>
              <Link className="footer-product-link" to="/about">About Us</Link>
              <Link className="footer-product-link" to="/quiz">Assessment Check</Link>
              <Link className="footer-product-link" to="/dashboard">Dashboard</Link>
            </div>
          </div>

          <div>
            <h3>Resources</h3>
            <div className="footer-col-links">
              <button
                type="button"
                className="footer-resource-link"
                onClick={() => setActiveResource('about')}
              >
                About screening
              </button>
              <button
                type="button"
                className="footer-resource-link"
                onClick={() => setActiveResource('faq')}
              >
                Frequently Asked Questions
              </button>
              <button
                type="button"
                className="footer-resource-link"
                onClick={() => setActiveResource('privacy')}
              >
                Privacy & Data
              </button>
              <button
                type="button"
                className="footer-resource-link"
                onClick={() => setActiveResource('terms')}
              >
                Terms of Use
              </button>
            </div>
          </div>

          <div>
            <h3>24/7 Crisis Support</h3>
            <p className="small-copy">
              If you or someone you know is in immediate danger or distress,
              please connect with immediate support:
            </p>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="small-copy" style={{ color: '#FFF', fontWeight: 600 }}>
                • Lifeline: 13 11 14 (24/7)
              </span>
              <span className="small-copy" style={{ color: '#FFF', fontWeight: 600 }}>
                • Beyond Blue: 1300 22 4636
              </span>
              <span className="small-copy" style={{ color: '#FFF', fontWeight: 600 }}>
                • Emergency Services: 000 / 911
              </span>
            </div>
          </div>
        </div>

        <div className="shell footer-bottom">
          <span>© 2026 WellBeingCheck. All rights reserved.</span>
          <span>Confidential screening tool — Not a clinical diagnosis.</span>
        </div>
      </footer>

      <ResourceModal
        resource={activeResource}
        onClose={() => setActiveResource(null)}
      />
    </>
  );
}

export const featureData = [
  [
    ShieldCheck,
    'Confidential & Private',
    'Your responses remain private to you. No tracking, no data selling, complete peace of mind.'
  ],
  [
    FileText,
    'Immediate Insights',
    'Get a clear, private response summary organised by the company questionnaire sections.'
  ],
  [
    ListChecks,
    'Official Company Questionnaire',
    'The multi-section Tune In check covers emotional, spiritual, relational and ministry wellbeing.'
  ],
  [
    ChartNoAxesCombined,
    'Meaningful Trajectory',
    'Track how your wellbeing changes over weeks and months to recognize patterns early.'
  ]
];

export function Disclaimer() {
  return (
    <aside className="disclaimer" role="note">
      <TriangleAlert size={18} />
      <div>
        <strong>Please Note:</strong> WellBeingCheck is an evidence-informed self-reflection and
        screening tool, not a clinical diagnosis or emergency service. Always discuss any health
        concerns with your doctor, psychologist, or healthcare provider.
      </div>
    </aside>
  );
}

export function BottomNav() {
  const user = JSON.parse(localStorage.getItem('wbc-user') || 'null');

  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
        <House size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''}>
        <ClipboardList size={20} />
        <span>Quiz</span>
      </NavLink>

      <NavLink to="/results" className={({ isActive }) => isActive ? 'active' : ''}>
        <ChartNoAxesCombined size={20} />
        <span>Results</span>
      </NavLink>

      <NavLink to={user ? "/dashboard" : "/login"} className={({ isActive }) => isActive ? 'active' : ''}>
        <UserRound size={20} />
        <span>{user ? 'Account' : 'Log In'}</span>
      </NavLink>
    </nav>
  );
}

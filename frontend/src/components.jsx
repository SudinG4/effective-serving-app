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
  Menu,
  X
} from 'lucide-react';

export function Logo() {
  const isLoggedIn =
    !!localStorage.getItem('wbc-access-token');

  return (
    <Link
      className="logo"
      to={isLoggedIn ? '/dashboard' : '/'}
      aria-label="WellBeingCheck home"
    >
      <span className="logo-mark">
        <HeartPulse size={21} />
      </span>
      <span>WellBeingCheck</span>
    </Link>
  );
}

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = Boolean(
    localStorage.getItem('wbc-user') && localStorage.getItem('wbc-access-token')
  );

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="public-header">
      <div className="shell nav">
        <Logo />

        <button
          className="nav-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <nav
          id="public-navigation"
          className={`nav-actions${menuOpen ? ' is-open' : ''}`}
          aria-label="Main navigation"
        >
          {isLoggedIn ? (
            <Link className="button small" to="/dashboard" onClick={() => setMenuOpen(false)}>
              Back to Dashboard
            </Link>
          ) : (
            <>
              <Link className="text-link" to="/login" onClick={() => setMenuOpen(false)}>
                Log In
              </Link>

              <Link className="button small" to="/signup" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const resourceContent = {
  about: {
    title: 'About screening',
    content: (
      <>
        <p>
          WellBeingCheck is designed to help you reflect on your current
          wellbeing and understand how you have been tracking across several
          areas of everyday life.
        </p>

        <h3>What is wellbeing screening?</h3>
        <p>
          Wellbeing screening uses a structured set of questions to identify
          patterns in areas such as mood, stress, emotional wellbeing, sleep,
          social connection and daily functioning.
        </p>

        <h3>What does the assessment do?</h3>
        <p>
          The assessment provides a summary based on your responses. It is
          intended to support awareness and reflection rather than provide a
          clinical diagnosis.
        </p>

        <h3>Who is it for?</h3>
        <p>
          It is intended for people who want a simple way to check in with
          themselves and better understand their current wellbeing.
        </p>
      </>
    )
  },

  faq: {
    title: 'Frequently asked questions',
    content: (
      <div className="modal-faq-list">
        <details>
          <summary>How long does the assessment take?</summary>
          <p>
            The assessment is designed to take only a few minutes to complete.
          </p>
        </details>

        <details>
          <summary>Is WellBeingCheck a medical diagnosis?</summary>
          <p>
            No. WellBeingCheck is a screening and self-reflection tool and
            does not provide a medical diagnosis.
          </p>
        </details>

        <details>
          <summary>Can I take the assessment again?</summary>
          <p>
            Yes. You can complete another assessment whenever you want to check
            in with your wellbeing again.
          </p>
        </details>

        <details>
          <summary>Where are my results stored?</summary>
          <p>
            In this demonstration version, account and assessment information
            is stored locally in your browser.
          </p>
        </details>

        <details>
          <summary>Can other people see my results?</summary>
          <p>
            This demo is designed to keep your informationwithin the browser
            you are using. It should not be considered a production-grade
            system for sensitive health information.
          </p>
        </details>

        <details>
          <summary>What if I am worried about my results?</summary>
          <p>
            Consider speaking with a qualified health professional. If you are
            in immediate danger, contact your local emergency service.
          </p>
        </details>
      </div>
    )
  },

  privacy: {
    title: 'Privacy policy',
    content: (
      <>
        <p className="modal-updated">Last updated: August 2026</p>

        <h3>Information we use</h3>
        <p>
          WellBeingCheck may use information you provide when creating an
          account and completing wellbeing assessments.
        </p>

        <h3>How information is used</h3>
        <p>
          Information is used to provide application functionality, calculate
          assessment results and display wellbeing information back to you.
        </p>

        <h3>Local browser storage</h3>
        <p>
          This demonstration currently stores information in your browser
          using local storage.
        </p>

        <h3>Sensitive information</h3>
        <p>
          This demonstration should not be treated as a production-grade
          platform for storing sensitive health information. A real-world
          system would require stronger privacy, security and data-governance
          controls.
        </p>

        <h3>Data sharing</h3>
        <p>
          The current demonstration is not designed to sell or share your
          assessment responses with third parties.
        </p>

        <h3>Demonstration notice</h3>
        <p>
          This privacy policy is provided for demonstration purposes and is not
          a professionally reviewed privacy policy for a production healthcare
          service.
        </p>
      </>
    )
  },

  terms: {
    title: 'Terms of use',
    content: (
      <>
        <p className="modal-updated">Last updated: August 2026</p>

        <h3>Purpose of WellBeingCheck</h3>
        <p>
          WellBeingCheck provides general wellbeing screening and
          informational feedback to support personal reflection.
        </p>

        <h3>Not medical advice</h3>
        <p>
          Assessment results and information provided by WellBeingCheck do not
          constitute medical advice, diagnosis or treatment.
        </p>

        <h3>No emergency services</h3>
        <p>
          WellBeingCheck is not an emergency or crisis service. If you are in
          immediate danger or require urgent assistance, contact your local
          emergency service.
        </p>

        <h3>Responsible use</h3>
        <p>
          You should use this application only for its intended purpose and
          should not attempt to interfere with or disrupt its functionality.
        </p>

        <h3>Accuracy and limitations</h3>
        <p>
          Results depend on the responses provided and areintended only as
          general wellbeing guidance. They should not replace professional
          assessment.
        </p>

        <h3>Demonstration application</h3>
        <p>
          WellBeingCheck is currently a demonstration application. Features,
          data-handling practices and functionality may change during
          development.
        </p>
      </>
    )
  }
};

export function ResourceModal({ resource, onClose }) {
  const selected = resourceContent[resource];

  useEffect(() => {
    if (!selected) {
      return;
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('modal-open');
    };
  }, [selected, onClose]);

  if (!selected) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
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
            <span className="modal-label">WellBeingCheck</span>
            <h2 id="resource-modal-title">{selected.title}</h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div className="resource-modal-content">
          {selected.content}
        </div>

        <div className="resource-modal-footer">
          <p>Screening tool only — not a diagnosis.</p>

          <button
            type="button"
            className="button small"
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

            <p className="muted footer-about">
              Evidence-informed wellbeing screening that gives people clear,
              private insight into how they’re really tracking.
            </p>
          </div>

          <div>
            <h3>Product</h3>

            <Link className="footer-product-link" to="/">
              Home
            </Link>

            <Link className="footer-product-link" to="/quiz">
              Assessment
            </Link>

            <Link className="footer-product-link" to="/dashboard">
              Dashboard
            </Link>
          </div>

          <div>
            <h3>Resources</h3>

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
              FAQs
            </button>

            <button
              type="button"
              className="footer-resource-link"
              onClick={() => setActiveResource('privacy')}
            >
              Privacy policy
            </button>

            <button
              type="button"
              className="footer-resource-link"
              onClick={() => setActiveResource('terms')}
            >
              Terms
            </button>
          </div>

          <div>
            <h3>Crisis support</h3>

            <p className="muted small-copy">
              If you are in immediate danger, call your local emergency
              service. This demo does not provide emergency care.
            </p>
          </div>
        </div>

        <div className="shell footer-bottom">
          <span>© 2026 WellBeingCheck</span>
          <span>Screening tool only — not a diagnosis.</span>
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
    'Secure & Private',
    'Your responses stay confidential and are stored only in this browser demo.'
  ],
  [
    FileText,
    'Instant Reports',
    'Get a clear, plain-language summary the moment you finish.'
  ],
  [
    ListChecks,
    '27-Point Assessment',
    'A structured screen across five wellbeing domains.'
  ],
  [
    ChartNoAxesCombined,
    'Clear Results',
    'Understand your score with labelled, colour-coded guidance.'
  ]
];

export function Disclaimer() {
  return (
    <p className="disclaimer">
      <TriangleAlert size={17} />
      WellBeingCheck is a screening tool, not a diagnosticor emergency
      service. Discuss concerns with a qualified health professional.
    </p>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Dashboard navigation">
      <NavLink to="/dashboard">
        <House />
        <span>Home</span>
      </NavLink>

      <NavLink to="/quiz">
        <ClipboardList />
        <span>Assessment</span>
      </NavLink>

      <NavLink to="/results">
        <ChartNoAxesCombined />
        <span>Results</span>
      </NavLink>

      <a href="#account">
        <UserRound />
        <span>Account</span>
      </a>
    </nav>
  );
}

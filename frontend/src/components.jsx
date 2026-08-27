import { Link, NavLink } from 'react-router-dom';
import { HeartPulse, ShieldCheck, FileText, ListChecks, ChartNoAxesCombined, House, ClipboardList, UserRound, TriangleAlert } from 'lucide-react';

export function Logo(){return <Link className="logo" to="/" aria-label="WellBeingCheck home"><span className="logo-mark"><HeartPulse size={21}/></span><span>WellBeingCheck</span></Link>}

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="shell nav">
        <Logo />

        <div className="nav-actions">
          <Link className="text-link" to="/about">
            About Us
          </Link>

          <Link className="text-link" to="/login">
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer(){return <footer><div className="shell footer-grid"><div><Logo/><p className="muted footer-about">Evidence-informed wellbeing screening that gives people clear, private insight into how they’re really tracking.</p></div><div><h3>Product</h3><Link to="/">Home</Link><Link to="/quiz">Assessment</Link><Link to="/dashboard">Dashboard</Link></div><div><h3>Resources</h3><a href="#about">About screening</a><a href="#faq">FAQs</a><a href="#privacy">Privacy policy</a><a href="#terms">Terms</a></div><div><h3>Crisis support</h3><p className="muted small-copy">If you are in immediate danger, call your local emergency service. This demo does not provide emergency care.</p></div></div><div className="shell footer-bottom"><span>© 2026 WellBeingCheck</span><span>Screening tool only — not a diagnosis.</span></div></footer>}

export const featureData=[
  [ShieldCheck,'Secure & Private','Your responses stay confidential and are stored only in this browser demo.'],
  [FileText,'Instant Reports','Get a clear, plain-language summary the moment you finish.'],
  [ListChecks,'27-Point Assessment','A structured screen across five wellbeing domains.'],
  [ChartNoAxesCombined,'Clear Results','Understand your score with labelled, colour-coded guidance.']
];

export function Disclaimer(){return <p className="disclaimer"><TriangleAlert size={17}/> WellBeingCheck is a screening tool, not a diagnostic or emergency service. Discuss concerns with a qualified health professional.</p>}

export function BottomNav(){return <nav className="bottom-nav" aria-label="Dashboard navigation"><NavLink to="/dashboard"><House/><span>Home</span></NavLink><NavLink to="/quiz"><ClipboardList/><span>Assessment</span></NavLink><NavLink to="/results"><ChartNoAxesCombined/><span>Results</span></NavLink><a href="#account"><UserRound/><span>Account</span></a></nav>}

import { PublicHeader, Footer, Disclaimer } from "../components";
import { Link } from "react-router-dom";
import {
  HandHeart,
  HeartHandshake,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  Feather,
  Quote
} from "lucide-react";
import "./about.css";

export default function About() {
  return (
    <>
      <PublicHeader />

      <main className="about-page shell">
        {/* Intro Hero */}
        <section className="about-intro">
          <div className="about-intro-text">
            <span className="eyebrow terracotta">
              <Sparkles size={15} />
              Our Mission & Philosophy
            </span>
            <h1>Supporting those who dedicate their lives to serving others.</h1>
            <p className="about-intro-lead">
              Caregivers, healthcare workers, educators, and community helpers often carry
              immense emotional weight. WellBeingCheck was created to offer a respectful,
              safe, and confidential check-in—empowering you to notice early signs of fatigue
              and nurture your own wellbeing.
            </p>

            <div className="about-cta-row">
              <Link className="button" to="/quiz">
                Take the Wellbeing Check <ArrowRight size={16} />
              </Link>
              <Link className="button secondary" to="/about-screening">
                Learn About Methodology
              </Link>
            </div>
          </div>

          <div className="about-hero-graphic">
            <div className="about-art-card">
              <div className="art-card-top">
                <span className="art-tag">Core Value</span>
                <HeartHandshake size={28} className="art-icon" />
              </div>
              <div className="art-quote">
                <Quote size={20} className="quote-mark" />
                <p>
                  “You cannot pour from an empty vessel. Taking a moment to check in with
                  yourself is an act of care for both you and everyone you support.”
                </p>
              </div>
              <div className="art-card-footer">
                <span className="art-author">WellBeingCheck Clinical Guidance</span>
                <span className="art-date">2026 Framework</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="about-pillars-section">
          <div className="about-section-header">
            <span className="eyebrow">Our Foundational Pillars</span>
            <h2>How we approach your wellbeing</h2>
            <p>
              Every element of our screening is built on principles of psychological safety,
              dignity, and evidence-informed insights.
            </p>
          </div>

          <div className="about-pillars-grid">
            <article className="pillar-card">
              <div className="pillar-number">01</div>
              <div className="pillar-icon-wrap">
                <HandHeart size={24} />
              </div>
              <h3>Care for the Caregiver</h3>
              <p>
                People who support others routinely normalize chronic stress, emotional exhaustion,
                and compassion fatigue. We provide a space designed specifically to center your
                needs without guilt or judgment.
              </p>
            </article>

            <article className="pillar-card">
              <div className="pillar-number">02</div>
              <div className="pillar-icon-wrap accent">
                <Feather size={24} />
              </div>
              <h3>Trauma-Informed & Gentle</h3>
              <p>
                We recognize that stress and past life experiences shape how each person experiences
                the world. Our screening uses respectful, non-stigmatizing language that encourages
                honest self-reflection at your own pace.
              </p>
            </article>

            <article className="pillar-card">
              <div className="pillar-number">03</div>
              <div className="pillar-icon-wrap sage">
                <Compass size={24} />
              </div>
              <h3>Actionable Clarity</h3>
              <p>
                A score is only helpful if it guides positive action. We break down results across
                five everyday life dimensions with practical self-care adjustments, conversation
                starters, and trusted support resources.
              </p>
            </article>
          </div>
        </section>

        {/* Principles Table / Row */}
        <section className="about-commitments">
          <div className="commitments-header">
            <h2>Our commitments to you</h2>
          </div>

          <div className="commitments-grid">
            <div className="commitment-item">
              <ShieldCheck size={24} className="commit-icon" />
              <div>
                <h4>Zero Tracking & Full Confidentiality</h4>
                <p>Your responses are never sold, profiled, or used for advertising. Your results stay yours.</p>
              </div>
            </div>

            <div className="commitment-item">
              <Users size={24} className="commit-icon" />
              <div>
                <h4>Grounded in Validated Screening</h4>
                <p>Designed around validated psychological frameworks across mood, stress, sleep, and connection.</p>
              </div>
            </div>

            <div className="commitment-item">
              <Compass size={24} className="commit-icon" />
              <div>
                <h4>Supportive, Not Diagnostic</h4>
                <p>We empower self-awareness and provide a stepping stone to meaningful conversations with doctors or mentors.</p>
              </div>
            </div>
          </div>
        </section>

        <Disclaimer />
      </main>

      <Footer />
    </>
  );
}
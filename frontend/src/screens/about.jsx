import { PublicHeader, Footer } from "../components";
import { HandHeart, Activity } from "lucide-react";
import "./about.css";

export default function About() {
  return (
    <>
      <PublicHeader />

      <main className="about-page shell">
        <section className="about-intro">
           <div className="about-intro-text">
            <h1>About Us</h1>
            <h2>Supporting those who serve</h2>

            <p>
                WellBeingCheck is designed to support the wellbeing of people who
                serve and care for others.
                We recognise the unique pressures that can come with helping and
                supporting others, and aim to provide practical tools that
                encourage awareness, reflection and early support.
            </p>
           </div>

           <div className="about-visual">
            <div className="about-hand-heart">
                <HandHeart size={150} strokeWidth={1} />
                <Activity className="about-pulse" strokeWidth={2.0} />
            </div>
           </div>
        </section>

        <section className="about-list">
          <article className="about-item">
            <div className="about-number">01</div>

            <div>
              <h2>Supporting those who serve</h2>
              <p>
                We focus on the wellbeing of people who support others in their
                daily lives. Caring for others can bring unique emotional and
                practical pressures, and regular check-ins can help build
                greater awareness of wellbeing.
              </p>
            </div>
          </article>

          <article className="about-item">
            <div className="about-number">02</div>

            <div>
              <h2>A trauma-informed approach</h2>
              <p>
                Our approach considers wellbeing through a trauma-informed
                lens, recognising that stress, burnout and challenging
                experiences can affect people in different ways.
              </p>

              <p>
                The aim is to provide a respectful and supportive way for
                individuals to reflect on how they are doing.
              </p>
            </div>
          </article>

          <article className="about-item">
            <div className="about-number">03</div>

            <div>
              <h2>Understand where you are</h2>
              <p>
                This wellbeing check helps users reflect across five key areas
                and receive a clear, private summary of their results.
              </p>

              <p>
                It is designed to support awareness and guide possible next
                steps, rather than provide a diagnosis.
              </p>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { GiTennisRacket } from "react-icons/gi";

const Home = () => {
  return (
    <main className="container">
      <section className="hero">
        <div className="hero-icon">
          <GiTennisRacket size={56} />
        </div>
        <h1 className="title">PicklePlay Courts</h1>
        <p className="subtitle">
          Book your pickleball court with friends. Minimum 2 to start, full 4 to confirm!
        </p>
        <div className="actions">
          <Link className="btn btn-primary btn-large" to="/book">
            Book a Court
          </Link>
          <Link className="btn btn-secondary btn-large" to="/courts">
            View Courts
          </Link>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <h3>No App Required</h3>
          <p>Reserve directly from your browser with a few taps.</p>
        </div>
        <div className="feature-card">
          <h3>Playful & Fast</h3>
          <p>Vibrant design with real-time availability and quick booking.</p>
        </div>
        <div className="feature-card">
          <h3>Groups of 4</h3>
          <p>Reservations confirm when your group reaches 4 players.</p>
        </div>
      </section>
    </main>
  );
};

export default Home;

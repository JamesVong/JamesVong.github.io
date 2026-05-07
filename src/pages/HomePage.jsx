import { useState } from 'react'
import GaussianSplatViewer from '../components/GaussianSplatViewer'

const isMobile = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
import ProjectCard from '../components/ProjectCard'
import {
  education,
  publications,
  experience,
  projects,
  skills,
} from '../data/resumeData'

export default function HomePage() {
  const [quality, setQuality] = useState(isMobile() ? 'fast' : 'high')

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="splat-viewer-area">
          <GaussianSplatViewer quality={quality} />
          <div className="hero-text">
            <h1>James Vong</h1>
            <p>Computer Science &amp; Engineering · AI / ML Research · Santa Clara University</p>
          </div>
        </div>
      </section>
      <div className="splat-bar">
        <div className="splat-bar-controls">
          <button
            className={`splat-bar-btn${quality === 'high' ? ' active' : ''}`}
            onClick={() => setQuality('high')}
          >Quality</button>
          <button
            className={`splat-bar-btn${quality === 'fast' ? ' active' : ''}`}
            onClick={() => setQuality('fast')}
          >Fast</button>
        </div>
        <p className="splat-caption">
          <strong>Santa Clara University Imaginarium Space</strong>
          {' '}— A space at the intersection of technology, arts, and humanities, dedicated to exploring extended reality, data visualization, digital art, and game design.
        </p>
      </div>

      {/* ── ABOUT ── */}
      <section className="section" id="about">
        <div className="container">
          <h2 className="section-title">About</h2>
          <p className="about-text">
            MS Computer Science candidate at Santa Clara University (GPA 3.7), focusing on AI,
            computer vision, and neural rendering. Research team leader at the SCU Imaginarium AI
            Research Lab under Dr. D. Jeong, with work co-authored and accepted to ICCV 2025.
            Experienced across the stack — from embedded C and CUDA kernels to production web apps —
            and a persistent competitor in hackathons with multiple awards.
          </p>
        </div>
      </section>

      {/* ── PUBLICATIONS ── */}
      <section className="section section-alt" id="publications">
        <div className="container">
          <h2 className="section-title">Publications</h2>
          {publications.map((pub, i) => (
            <div key={i} className="publication-card">
              <h3>{pub.title}</h3>
              <span className="pub-venue">{pub.venue}</span>
              <p className="pub-authors">{pub.authors}</p>
              <p className="pub-description">{pub.description}</p>
              {pub.link && (
                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="pub-link">
                  Read Paper →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="section" id="experience">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="experience-item">
              <div className="experience-header">
                <div>
                  <h3>{exp.role}</h3>
                  <p className="experience-org">{exp.org} &nbsp;·&nbsp; {exp.advisor}</p>
                </div>
                <div className="experience-meta">
                  <span>{exp.location}</span>
                  <span>{exp.dates}</span>
                </div>
              </div>
              <ul className="experience-bullets">
                {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="section section-alt" id="projects">
        <div className="container">
          <h2 className="section-title">Projects &amp; Moments</h2>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="section" id="education">
        <div className="container">
          <h2 className="section-title">Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="education-item">
              <div className="education-header">
                <h3>{edu.degree}</h3>
                <span className="education-date">{edu.graduation}</span>
              </div>
              <p className="education-school">{edu.school} · {edu.location}</p>
              <p className="education-gpa">GPA: {edu.gpa}</p>
              <p className="education-details">{edu.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="section" id="skills">
        <div className="container">
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            {[
              { label: 'Programming Languages', items: skills.languages },
              { label: 'Frameworks & Libraries', items: skills.frameworks },
              { label: 'Developer Tools', items: skills.tools },
              { label: 'Databases', items: skills.databases },
            ].map(({ label, items }) => (
              <div key={label} className="skill-group">
                <h4>{label}</h4>
                <div className="skill-tags">
                  {items.map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

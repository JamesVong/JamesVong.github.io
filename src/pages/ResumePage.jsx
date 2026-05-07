export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="container">
        <div className="resume-header">
          <h1>Resume</h1>
          <a href="/James-Vong-Resume-2026.pdf" download className="btn">
            ↓ Download PDF
          </a>
        </div>
        <div className="pdf-viewer-wrapper">
          <iframe
            src="/James-Vong-Resume-2026.pdf"
            title="James Vong Resume"
            className="pdf-viewer"
          />
        </div>
      </div>
    </main>
  )
}

export default function ProjectCard({ project }) {
  const { title, date, category, description, tags, link, featured } = project

  return (
    <div className={`project-card${featured ? ' featured' : ''}`}>
      <div className="project-card-header">
        <span className="project-category">{category}</span>
        <span className="project-date">{date}</span>
      </div>
      <h3 className="project-title">{title}</h3>
      <p className="project-description">{description}</p>
      <div className="project-tags">
        {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
          View Project →
        </a>
      )}
    </div>
  )
}

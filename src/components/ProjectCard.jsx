const hideOnError = (e) => { e.currentTarget.style.display = 'none' }

export default function ProjectCard({ project }) {
  const { title, date, category, description, tags, links, image } = project

  return (
    <div className="project-card">
      {image && (
        <img
          className="project-thumb"
          src={image}
          alt={`${title} screenshot`}
          loading="lazy"
          onError={hideOnError}
        />
      )}
      <div className="project-body">
        <div className="project-card-header">
          <span className="project-category">{category}</span>
          <span className="project-date">{date}</span>
        </div>
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        <div className="project-tags">
          {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
        {links && links.length > 0 && (
          <div className="project-links">
            {links.map(({ url, label }) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="project-link">
                {label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">James Vong</Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link${pathname === '/' ? ' active' : ''}`}>Home</Link>
          <Link to="/resume" className={`nav-link${pathname === '/resume' ? ' active' : ''}`}>Resume</Link>
        </div>
      </div>
    </nav>
  )
}

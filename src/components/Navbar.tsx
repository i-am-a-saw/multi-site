interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const pages = [
    { id: 'home', label: 'Главная' },
    { id: 'movies', label: 'Фильмы' },
    { id: 'currency', label: 'Валюты' },
    { id: 'weather', label: 'Погода' },
    { id: 'quotes', label: 'Цитаты' },
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">Multi-Site</div>
        <ul className="nav-links">
          {pages.map((page) => (
            <li key={page.id}>
              <button
                className={`nav-link ${currentPage === page.id ? 'active' : ''}`}
                onClick={() => onNavigate(page.id)}
              >
                {page.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
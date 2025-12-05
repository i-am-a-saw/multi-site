interface HomePageProps {
  onNavigate: (page: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: '🎬',
      title: 'Фильмы',
      description: 'Поиск и просмотр информации о фильмах',
      page: 'movies'
    },
    {
      icon: '💱',
      title: 'Валюты',
      description: 'Конвертация и курсы валют в реальном времени',
      page: 'currency'
    },
    {
      icon: '🌤️',
      title: 'Погода',
      description: 'Прогноз погоды для вашего города',
      page: 'weather'
    },
    {
      icon: '💬',
      title: 'Цитаты',
      description: 'Вдохновляющие цитаты великих людей',
      page: 'quotes'
    }
  ]

  return (
    <div className="page">
      <h1 className="page-title">Добро пожаловать в Multi-Site</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem' }}>
        Выберите интересующую вас категорию
      </p>
      <div className="home-grid">
        {features.map((feature) => (
          <div
            key={feature.page}
            className="feature-card"
            onClick={() => onNavigate(feature.page)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h2 className="feature-title">{feature.title}</h2>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
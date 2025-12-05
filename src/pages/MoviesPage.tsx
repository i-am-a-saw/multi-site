import { useState } from 'react'

interface Movie {
  id: number
  title: string
  year: number
  poster: string
}

export function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchMovies = async () => {
    if (!search.trim()) {
      setError('Введите название фильма')
      return
    }

    setLoading(true)
    setError('')
    setMovies([])

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(search)}&type=movie&apikey=72585386`
      )
      const data = await response.json()

      if (data.Response === 'False') {
        setError('Фильмы не найдены')
      } else {
        setMovies(data.Search || [])
      }
    } catch (err) {
      setError('Ошибка при поиске фильмов')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">🎬 Поиск Фильмов</h1>
      
      <div className="card">
        <div className="form-group">
          <label>Название фильма:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchMovies()}
            placeholder="Введите название фильма..."
          />
        </div>
        <button className="btn" onClick={searchMovies} disabled={loading}>
          {loading ? 'Поиск...' : 'Поиск'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      
      {loading && <div className="loading">Загрузка...</div>}

      <div className="grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-year">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export class MoviesPage {
  constructor() {
    this.movies = []
  }

  render() {
    const page = document.createElement('div')
    page.className = 'page'
    page.innerHTML = `
      <h1 class="page-title">🎬 Библиотека фильмов</h1>
      <div class="card">
        <div class="form-group">
          <label for="movie-search">Поиск фильмов</label>
          <input 
            type="text" 
            id="movie-search" 
            placeholder="Введите название фильма..."
          >
        </div>
        <button class="btn" id="search-btn">Искать</button>
      </div>
      <div id="movies-container"></div>
    `
    return page
  }

  init() {
    const searchBtn = document.getElementById('search-btn')
    const searchInput = document.getElementById('movie-search')

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchMovies()
      }
    })

    searchBtn.addEventListener('click', () => this.searchMovies())

    // Load some default movies
    this.loadDefaultMovies()
  }

  async loadDefaultMovies() {
    const defaultTitles = ['Matrix', 'Inception', 'Interstellar', 'Avatar']
    const container = document.getElementById('movies-container')
    container.innerHTML = '<div class="loading">Загрузка фильмов...</div>'

    try {
      const moviePromises = defaultTitles.map(title => 
        fetch(`https://www.omdbapi.com/?apikey=3e6e91c9&t=${title}`)
          .then(res => res.json())
      )

      const movies = await Promise.all(moviePromises)
      this.displayMovies(movies.filter(m => m.Response === 'True'))
    } catch (error) {
      container.innerHTML = '<div class="error">Ошибка загрузки фильмов</div>'
    }
  }

  async searchMovies() {
    const query = document.getElementById('movie-search').value.trim()
    const container = document.getElementById('movies-container')

    if (!query) {
      this.loadDefaultMovies()
      return
    }

    container.innerHTML = '<div class="loading">Поиск...</div>'

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=3e6e91c9&s=${query}`)
      const data = await response.json()

      if (data.Response === 'True') {
        // Fetch detailed info for each movie
        const detailedMovies = await Promise.all(
          data.Search.slice(0, 6).map(movie =>
            fetch(`https://www.omdbapi.com/?apikey=3e6e91c9&i=${movie.imdbID}`)
              .then(res => res.json())
          )
        )
        this.displayMovies(detailedMovies)
      } else {
        container.innerHTML = '<div class="error">Фильмы не найдены</div>'
      }
    } catch (error) {
      container.innerHTML = '<div class="error">Ошибка поиска: ' + error.message + '</div>'
    }
  }

  displayMovies(movies) {
    const container = document.getElementById('movies-container')

    if (movies.length === 0) {
      container.innerHTML = '<div class="error">Фильмы не найдены</div>'
      return
    }

    container.innerHTML = `
      <div class="grid">
        ${movies.map(movie => `
          <div class="movie-card">
            <img 
              src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400?text=No+Poster'}" 
              alt="${movie.Title}"
              class="movie-poster"
            >
            <div class="movie-info">
              <h3 class="movie-title">${movie.Title}</h3>
              <p class="movie-year">${movie.Year}</p>
              <p style="color: var(--text-secondary); margin-top: 0.5rem;">
                ${movie.Genre || 'N/A'}
              </p>
              <p style="color: var(--text-secondary); margin-top: 0.5rem; font-size: 0.9rem;">
                ⭐ ${movie.imdbRating || 'N/A'}/10
              </p>
            </div>
          </div>
        `).join('')}
      </div>
    `
  }
}
import './style.css'
import { HomePage } from './pages/home.js'
import { MoviesPage } from './pages/movies.js'
import { CurrencyPage } from './pages/currency.js'
import { WeatherPage } from './pages/weather.js'
import { QuotesPage } from './pages/quotes.js'

class Router {
  constructor() {
    this.routes = {
      '/': HomePage,
      '/movies': MoviesPage,
      '/currency': CurrencyPage,
      '/weather': WeatherPage,
      '/quotes': QuotesPage
    }
    this.currentPage = null
    this.init()
  }

  init() {
    // Handle navigation
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-link')) {
        e.preventDefault()
        const path = e.target.getAttribute('href')
        this.navigate(path)
      }
    })

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.loadPage(window.location.pathname)
    })

    // Load initial page
    this.loadPage(window.location.pathname)
  }

  navigate(path) {
    window.history.pushState({}, '', path)
    this.loadPage(path)
  }

  loadPage(path) {
    // Handle base path for GitHub Pages
    const basePath = '/multi-site'
    let cleanPath = path
    if (path.startsWith(basePath)) {
      cleanPath = path.slice(basePath.length) || '/'
    }

    const PageClass = this.routes[cleanPath] || HomePage

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === cleanPath) {
        link.classList.add('active')
      }
    })

    // Cleanup previous page
    if (this.currentPage && this.currentPage.destroy) {
      this.currentPage.destroy()
    }

    // Render new page
    this.currentPage = new PageClass()
    const app = document.getElementById('app')
    app.innerHTML = ''
    app.appendChild(this.currentPage.render())

    // Initialize page if needed
    if (this.currentPage.init) {
      this.currentPage.init()
    }
  }
}

// Initialize router when DOM is ready
new Router()
import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { MoviesPage } from './pages/MoviesPage'
import { CurrencyPage } from './pages/CurrencyPage'
import { WeatherPage } from './pages/WeatherPage'
import { QuotesPage } from './pages/QuotesPage'

type Page = 'home' | 'movies' | 'currency' | 'weather' | 'quotes'

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'movies':
        return <MoviesPage />
      case 'currency':
        return <CurrencyPage />
      case 'weather':
        return <WeatherPage />
      case 'quotes':
        return <QuotesPage />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div id="app" className="page-container">
        {renderPage()}
      </div>
    </div>
  )
}
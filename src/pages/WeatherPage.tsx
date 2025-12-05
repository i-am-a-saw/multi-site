import { useState } from 'react'

interface WeatherData {
  temp: number
  feelsLike: number
  humidity: number
  pressure: number
  description: string
  city: string
}

export function WeatherPage() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getWeather = async () => {
    if (!city.trim()) {
      setError('Введите название города')
      return
    }

    setLoading(true)
    setError('')

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      )
      const geoData = await geoResponse.json()

      if (!geoData.results || geoData.results.length === 0) {
        setError('Город не найден')
        setLoading(false)
        return
      }

      const location = geoData.results[0]
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,apparent_temperature,pressure_msl&timezone=auto`
      )
      const weatherData = await weatherResponse.json()
      const current = weatherData.current

      setWeather({
        temp: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: Math.round(current.pressure_msl),
        description: getWeatherDescription(current.weather_code),
        city: `${location.name}, ${location.country}`
      })
    } catch (err) {
      setError('Ошибка при получении данных о погоде')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherDescription = (code: number): string => {
    const descriptions: { [key: number]: string } = {
      0: 'Ясно',
      1: 'Облачно',
      2: 'Переменная облачность',
      3: 'Пасмурно',
      45: 'Туман',
      48: 'Туман с морозью',
      51: 'Легкий дождь',
      53: 'Умеренный дождь',
      55: 'Сильный дождь',
    }
    return descriptions[code] || 'Неизвестно'
  }

  return (
    <div className="page">
      <h1 className="page-title">🌤️ Прогноз Погоды</h1>

      <div className="card">
        <div className="form-group">
          <label>Город:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && getWeather()}
            placeholder="Введите название города..."
          />
        </div>
        <button className="btn" onClick={getWeather} disabled={loading}>
          {loading ? 'Загрузка...' : 'Получить прогноз'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#dc143c' }}>
            {weather.city}
          </h2>

          <div className="weather-grid">
            <div className="weather-item">
              <div className="weather-label">Температура</div>
              <div className="weather-value">{weather.temp}°C</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Ощущается как</div>
              <div className="weather-value">{weather.feelsLike}°C</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Влажность</div>
              <div className="weather-value">{weather.humidity}%</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Давление</div>
              <div className="weather-value">{weather.pressure} мб</div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', color: '#dc143c' }}>
              {weather.description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
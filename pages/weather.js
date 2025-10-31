export class WeatherPage {
  render() {
    const page = document.createElement('div')
    page.className = 'page'
    page.innerHTML = `
      <h1 class="page-title">🌤️ Виджет погоды</h1>
      <div class="card">
        <div class="form-group">
          <label for="city-select">Выберите город</label>
          <select id="city-select">
            <option value="55.7558,37.6173">Москва, Россия</option>
            <option value="59.9343,30.3351">Санкт-Петербург, Россия</option>
            <option value="55.0084,82.9357">Новосибирск, Россия</option>
            <option value="51.5074,-0.1278">Лондон, Великобритания</option>
            <option value="40.7128,-74.0060">Нью-Йорк, США</option>
            <option value="48.8566,2.3522">Париж, Франция</option>
            <option value="35.6762,139.6503">Токио, Япония</option>
            <option value="52.5200,13.4050">Берлин, Германия</option>
          </select>
        </div>
        <button class="btn" id="get-weather-btn">Получить погоду</button>
      </div>
      <div id="weather-container"></div>
    `
    return page
  }

  init() {
    const getWeatherBtn = document.getElementById('get-weather-btn')
    getWeatherBtn.addEventListener('click', () => this.getWeather())

    // Load weather for default city
    this.getWeather()
  }

  async getWeather() {
    const citySelect = document.getElementById('city-select')
    const [latitude, longitude] = citySelect.value.split(',')
    const cityName = citySelect.options[citySelect.selectedIndex].text
    const container = document.getElementById('weather-container')

    container.innerHTML = '<div class="loading">Загрузка погоды...</div>'

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      )
      const data = await response.json()

      if (data && data.current) {
        this.displayWeather(data, cityName)
      } else {
        container.innerHTML = '<div class="error">Не удалось получить данные о погоде</div>'
      }
    } catch (error) {
      container.innerHTML = '<div class="error">Ошибка: ' + error.message + '</div>'
    }
  }

  displayWeather(data, cityName) {
    const container = document.getElementById('weather-container')
    const current = data.current
    const weatherDescription = this.getWeatherDescription(current.weather_code)

    container.innerHTML = `
      <div class="card">
        <h2 style="color: var(--primary-red); text-align: center; margin-bottom: 2rem;">
          ${cityName}
        </h2>
        <div class="weather-grid">
          <div class="weather-item">
            <div class="weather-label">Температура</div>
            <div class="weather-value">${current.temperature_2m}°C</div>
          </div>
          <div class="weather-item">
            <div class="weather-label">Влажность</div>
            <div class="weather-value">${current.relative_humidity_2m}%</div>
          </div>
          <div class="weather-item">
            <div class="weather-label">Скорость ветра</div>
            <div class="weather-value">${current.wind_speed_10m} км/ч</div>
          </div>
          <div class="weather-item">
            <div class="weather-label">Состояние</div>
            <div class="weather-value" style="font-size: 1.3rem;">${weatherDescription}</div>
          </div>
        </div>
      </div>
      ${data.daily ? `
        <div class="card">
          <h3 style="color: var(--primary-red); margin-bottom: 1rem;">Прогноз на неделю</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
            ${data.daily.time.slice(0, 7).map((date, i) => `
              <div style="text-align: center; padding: 1rem; background: rgba(220, 20, 60, 0.1); border-radius: 8px;">
                <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">
                  ${new Date(date).toLocaleDateString('ru-RU', { weekday: 'short' })}
                </div>
                <div style="color: var(--primary-red); font-weight: bold;">
                  ${Math.round(data.daily.temperature_2m_max[i])}°
                </div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">
                  ${Math.round(data.daily.temperature_2m_min[i])}°
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `
  }

  getWeatherDescription(code) {
    const weatherCodes = {
      0: '☀️ Ясно',
      1: '🌤️ Преимущ. ясно',
      2: '⛅ Переменная облачность',
      3: '☁️ Облачно',
      45: '🌫️ Туман',
      48: '🌫️ Изморозь',
      51: '🌦️ Легкая морось',
      53: '🌦️ Морось',
      55: '🌧️ Сильная морось',
      61: '🌧️ Слабый дождь',
      63: '🌧️ Дождь',
      65: '⛈️ Сильный дождь',
      71: '🌨️ Слабый снег',
      73: '🌨️ Снег',
      75: '❄️ Сильный снег',
      95: '⛈️ Гроза'
    }
    return weatherCodes[code] || '🌤️ Неизвестно'
  }
}
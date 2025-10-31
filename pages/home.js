export class HomePage {
  render() {
    const page = document.createElement('div')
    page.className = 'page'
    page.innerHTML = `
      <h1 class="page-title">Добро пожаловать в Multi-Site</h1>
      <div class="card">
        <p style="text-align: center; font-size: 1.2rem; color: var(--text-secondary); line-height: 1.8;">
          Многостраничное веб-приложение с интеграцией различных API.<br>
          Выберите раздел из меню навигации выше.
        </p>
      </div>
      <div class="home-grid">
        <div class="feature-card" data-page="movies">
          <div class="feature-icon">🎬</div>
          <h3 class="feature-title">Фильмы</h3>
          <p class="feature-description">Поиск информации о фильмах из базы данных OMDB</p>
        </div>
        <div class="feature-card" data-page="currency">
          <div class="feature-icon">💱</div>
          <h3 class="feature-title">Конвертер валют</h3>
          <p class="feature-description">Конвертация валют по актуальным курсам</p>
        </div>
        <div class="feature-card" data-page="weather">
          <div class="feature-icon">🌤️</div>
          <h3 class="feature-title">Погода</h3>
          <p class="feature-description">Прогноз погоды для любого города</p>
        </div>
        <div class="feature-card" data-page="quotes">
          <div class="feature-icon">💭</div>
          <h3 class="feature-title">Цитаты</h3>
          <p class="feature-description">Вдохновляющие цитаты великих людей</p>
        </div>
      </div>
    `
    return page
  }

  init() {
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', () => {
        const page = card.dataset.page
        const link = document.querySelector(`[data-page="${page}"]`)
        if (link && link.classList.contains('nav-link')) {
          link.click()
        }
      })
    })
  }
}
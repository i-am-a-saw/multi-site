export class QuotesPage {
  constructor() {
    this.currentQuote = null
  }

  render() {
    const page = document.createElement('div')
    page.className = 'page'
    page.innerHTML = `
      <h1 class="page-title">💭 Вдохновляющие цитаты</h1>
      <div class="card">
        <button class="btn" id="new-quote-btn">Получить новую цитату</button>
      </div>
      <div id="quote-container"></div>
    `
    return page
  }

  init() {
    const newQuoteBtn = document.getElementById('new-quote-btn')
    newQuoteBtn.addEventListener('click', () => this.getRandomQuote())

    // Load initial quote
    this.getRandomQuote()
  }

  async getRandomQuote() {
    const container = document.getElementById('quote-container')
    container.innerHTML = '<div class="loading">Загрузка цитаты...</div>'

    try {
      const response = await fetch('https://zenquotes.io/api/random')
      const data = await response.json()

      if (data && data[0]) {
        this.displayQuote(data[0])
      } else {
        // Fallback to local quotes if API fails
        this.displayFallbackQuote()
      }
    } catch (error) {
      // Use fallback quotes if API is unavailable
      this.displayFallbackQuote()
    }
  }

  displayQuote(quote) {
    const container = document.getElementById('quote-container')
    container.innerHTML = `
      <div class="quote-container">
        <div class="quote-text">"${quote.q || quote.quote}"</div>
        <div class="quote-author">— ${quote.a || quote.author}</div>
      </div>
    `
  }

  displayFallbackQuote() {
    const fallbackQuotes = [
      {
        q: "Единственный способ сделать отличную работу - это любить то, что вы делаете.",
        a: "Стив Джобс"
      },
      {
        q: "Жизнь - это то, что происходит с вами, пока вы строите другие планы.",
        a: "Джон Леннон"
      },
      {
        q: "Будущее принадлежит тем, кто верит в красоту своих мечтаний.",
        a: "Элеонора Рузвельт"
      },
      {
        q: "Лучшее время посадить дерево было 20 лет назад. Второе лучшее время - сейчас.",
        a: "Китайская пословица"
      },
      {
        q: "Ваше время ограничено, не тратьте его на жизнь чужой жизнью.",
        a: "Стив Джобс"
      },
      {
        q: "Успех - это способность идти от неудачи к неудаче, не теряя энтузиазма.",
        a: "Уинстон Черчилль"
      },
      {
        q: "Образование - самое мощное оружие, которое вы можете использовать, чтобы изменить мир.",
        a: "Нельсон Мандела"
      },
      {
        q: "Невозможное сегодня станет возможным завтра.",
        a: "Константин Циолковский"
      }
    ]

    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    this.displayQuote(randomQuote)
  }
}
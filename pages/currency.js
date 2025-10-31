export class CurrencyPage {
  constructor() {
    this.currencies = null
  }

  render() {
    const page = document.createElement('div')
    page.className = 'page'
    page.innerHTML = `
      <h1 class="page-title">💱 Конвертер валют</h1>
      <div class="card">
        <div class="form-group">
          <label for="amount">Сумма</label>
          <input 
            type="number" 
            id="amount" 
            placeholder="Введите сумму..."
            value="100"
            min="0"
            step="0.01"
          >
        </div>
        <div class="form-group">
          <label for="from-currency">Из валюты</label>
          <select id="from-currency">
            <option value="usd">USD - US Dollar</option>
            <option value="eur">EUR - Euro</option>
            <option value="gbp">GBP - British Pound</option>
            <option value="jpy">JPY - Japanese Yen</option>
            <option value="rub">RUB - Russian Ruble</option>
            <option value="cny">CNY - Chinese Yuan</option>
            <option value="chf">CHF - Swiss Franc</option>
            <option value="cad">CAD - Canadian Dollar</option>
            <option value="aud">AUD - Australian Dollar</option>
            <option value="inr">INR - Indian Rupee</option>
          </select>
        </div>
        <div class="form-group">
          <label for="to-currency">В валюту</label>
          <select id="to-currency">
            <option value="usd">USD - US Dollar</option>
            <option value="eur" selected>EUR - Euro</option>
            <option value="gbp">GBP - British Pound</option>
            <option value="jpy">JPY - Japanese Yen</option>
            <option value="rub">RUB - Russian Ruble</option>
            <option value="cny">CNY - Chinese Yuan</option>
            <option value="chf">CHF - Swiss Franc</option>
            <option value="cad">CAD - Canadian Dollar</option>
            <option value="aud">AUD - Australian Dollar</option>
            <option value="inr">INR - Indian Rupee</option>
          </select>
        </div>
        <button class="btn" id="convert-btn">Конвертировать</button>
      </div>
      <div id="result-container"></div>
    `
    return page
  }

  init() {
    const convertBtn = document.getElementById('convert-btn')
    convertBtn.addEventListener('click', () => this.convertCurrency())

    // Auto-convert on load
    this.convertCurrency()
  }

  async convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value)
    const fromCurrency = document.getElementById('from-currency').value
    const toCurrency = document.getElementById('to-currency').value
    const resultContainer = document.getElementById('result-container')

    if (!amount || amount <= 0) {
      resultContainer.innerHTML = '<div class="error">Пожалуйста, введите корректную сумму</div>'
      return
    }

    resultContainer.innerHTML = '<div class="loading">Конвертация...</div>'

    try {
      // Fetch exchange rates
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`
      )
      const data = await response.json()

      if (data && data[fromCurrency] && data[fromCurrency][toCurrency]) {
        const rate = data[fromCurrency][toCurrency]
        const result = amount * rate

        resultContainer.innerHTML = `
          <div class="currency-result">
            <div style="margin-bottom: 1rem; color: var(--text-secondary);">
              ${amount} ${fromCurrency.toUpperCase()}
            </div>
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">⇓</div>
            <div class="currency-amount">
              ${result.toFixed(2)} ${toCurrency.toUpperCase()}
            </div>
            <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
              Курс: 1 ${fromCurrency.toUpperCase()} = ${rate.toFixed(4)} ${toCurrency.toUpperCase()}
            </div>
          </div>
        `
      } else {
        resultContainer.innerHTML = '<div class="error">Не удалось получить курс валют</div>'
      }
    } catch (error) {
      resultContainer.innerHTML = '<div class="error">Ошибка: ' + error.message + '</div>'
    }
  }
}
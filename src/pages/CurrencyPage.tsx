import { useState } from 'react'

interface ConversionResult {
  amount: number
  from: string
  to: string
  result: number
  rate: number
}

export function CurrencyPage() {
  const [amount, setAmount] = useState('1')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('RUB')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currencies = ['USD', 'EUR', 'RUB', 'GBP', 'JPY', 'CNY']

  const convertCurrency = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Введите корректную сумму')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      )
      const data = await response.json()

      const rate = data.rates[toCurrency]
      const convertedAmount = Number(amount) * rate

      setResult({
        amount: Number(amount),
        from: fromCurrency,
        to: toCurrency,
        result: convertedAmount,
        rate: rate
      })
    } catch (err) {
      setError('Ошибка при получении курса валют')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">💱 Конвертер Валют</h1>

      <div className="card">
        <div className="form-group">
          <label>Сумма:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            placeholder="Введите сумму..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Из:</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>В:</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn" onClick={convertCurrency} disabled={loading}>
          {loading ? 'Конвертирование...' : 'Конвертировать'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="currency-result">
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            {result.amount} {result.from} =
          </p>
          <div className="currency-amount">
            {result.result.toFixed(2)} {result.to}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            Курс: 1 {result.from} = {result.rate.toFixed(4)} {result.to}
          </p>
        </div>
      )}
    </div>
  )
}
import { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
}

export function QuotesPage() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchQuote = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://api.quotable.io/random')
      const data = await response.json()
      setQuote({
        text: data.content,
        author: data.author.split(',')[0]
      })
    } catch (err) {
      console.error('Error fetching quote:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">💬 Цитаты</h1>

      {loading ? (
        <div className="loading">Загрузка цитаты...</div>
      ) : (
        <>
          {quote && (
            <div className="quote-container">
              <p className="quote-text">"{quote.text}"</p>
              <p className="quote-author">— {quote.author}</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn" onClick={fetchQuote}>
              Следующая цитата
            </button>
          </div>
        </>
      )}
    </div>
  )
}
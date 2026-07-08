import { useState } from 'react'

function ResultPanel({ flashcards }) {
  const [activeTab, setActiveTab] = useState('flashcards')

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [asking, setAsking] = useState(false)

  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)

  async function handleAskQuestion() {
    if (question.trim() === '') return

    setAsking(true)

    try {
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })

      const data = await response.json()
      setAnswer(data.answer)

    } catch (error) {
      console.error('Ask failed:', error)
      setAnswer('Something went wrong. Please try again.')
    } finally {
      setAsking(false)
    }
  }

  async function fetchSummary() {
    setLoadingSummary(true)

    try {
      const response = await fetch('http://localhost:5000/summary', {
        method: 'POST'
      })

      const data = await response.json()
      setSummary(data.summary)

    } catch (error) {
      console.error('Summary failed:', error)
      setSummary('Something went wrong generating the summary.')
    } finally {
      setLoadingSummary(false)
    }
  }

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === 'flashcards' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('flashcards')}
        >
          🃏 Flashcards
        </button>

        <button
          className={activeTab === 'questions' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('questions')}
        >
          💬 Ask
        </button>

        <button
          className={activeTab === 'summary' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => {
            setActiveTab('summary')
            if (!summary) fetchSummary()
          }}
        >
          📝 Summary
        </button>
      </div>

      {activeTab === 'flashcards' && (
        <div className="result-section">
          {(flashcards || []).map((card, index) => (
            <div className="flashcard" key={index}>
              <p className="question">Q: {card.question}</p>
              <p className="answer">A: {card.answer}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="result-section">
          <div className="qa-box">
            <input
              type="text"
              placeholder="Ask anything about your document..."
              className="qa-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button className="qa-btn" onClick={handleAskQuestion} disabled={asking}>
              {asking ? '🤖 Thinking...' : 'Ask'}
            </button>
          </div>

          {answer && (
            <div className="answer-box">
              {answer}
            </div>
          )}
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="result-section">
          {loadingSummary && (
            <p style={{ fontSize: '13px', color: '#534AB7', textAlign: 'center' }}>
              🤖 Generating summary...
            </p>
          )}

          {!loadingSummary && summary && (
            <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.8' }}>
              {summary}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ResultPanel
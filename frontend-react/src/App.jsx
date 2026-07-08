import './App.css'
import { useState } from 'react'
import UploadBox from './components/UploadBox'
import ResultPanel from './components/ResultPanel'

function App() {
  const [showResults, setShowResults] = useState(false)
  const [flashcards, setFlashcards] = useState([])
  const [resetKey, setResetKey] = useState(0)

  function handleAnalyseComplete(generatedFlashcards) {
    setFlashcards(generatedFlashcards)
    setShowResults(true)
     setResetKey(prev => prev + 1)   // forces ResultPanel to remount fresh
  }

  return (
    <div className="container">
      <div className="header">
        <h1>📄 DocMind</h1>
        <p className="subtitle">Upload your notes — AI generates flashcards instantly</p>
      </div>

      <UploadBox onAnalyseComplete={handleAnalyseComplete} />

      {showResults && <ResultPanel key={resetKey} flashcards={flashcards} />}
    </div>
  )
}

export default App
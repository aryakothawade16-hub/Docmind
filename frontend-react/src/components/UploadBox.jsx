import { useState } from 'react'

function UploadBox({ onAnalyseComplete }) {
  const [fileName, setFileName] = useState('No file selected')
  const [isReady, setIsReady] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleFile(event) {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setFileName('📎 ' + selectedFile.name)
      setIsReady(true)
      setFile(selectedFile)
    }
  }

  async function handleAnalyse() {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const response = await fetch('https://docmind-backend-w8qz.onrender.com/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Something went wrong. Please try again.')
        return
      }

      onAnalyseComplete(data.flashcards)

    } catch (error) {
      console.error('Upload failed:', error)
      alert('Could not connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div
        className="upload-box"
        onClick={() => document.getElementById('fileInput').click()}
      >
        <div className="upload-icon">☁️</div>
        <h3>Drop your PDF here</h3>
        <p>or click to browse files</p>
      </div>

      <input
        type="file"
        id="fileInput"
        accept=".pdf"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      <p className="file-name">{fileName}</p>

      <button
        className="btn"
        disabled={!isReady || loading}
        onClick={handleAnalyse}
      >
        {loading ? '🤖 Analysing...' : '✨ Analyse with AI'}
      </button>
    </div>
  )
}

export default UploadBox
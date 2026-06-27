const uploadBox = document.getElementById('uploadBox')
const fileInput = document.getElementById('fileInput')
const fileName = document.getElementById('fileName')
const analyseBtn = document.getElementById('analyseBtn')
const tabs = document.getElementById('tabs')
uploadBox.addEventListener('click', function() {
  fileInput.click()
})

// Step 3 — When user selects a PDF file
function handleFile(input) {
  const file = input.files[0]
  
  if (file) {
    fileName.textContent = '📎 ' + file.name
    analyseBtn.disabled = false
    uploadBox.classList.add('active')
  }
}
// Step 4 — When user clicks Analyse button
function handleAnalyse() {
  // Show the tabs
  tabs.style.display = 'flex'
  
  // Show flashcards section by default
  showTab('flashcards')
  
  // Change button text
  analyseBtn.textContent = '✅ Analysis Complete!'
}
// Step 5 — Switch between tabs
function showTab(tabName, btn) {
  // Hide all result sections
  document.getElementById('flashcards').style.display = 'none'
  document.getElementById('questions').style.display = 'none'
  document.getElementById('summary').style.display = 'none'

  // Show the clicked tab's section
  document.getElementById(tabName).style.display = 'block'

  // Remove active class from all tab buttons
  const allTabs = document.querySelectorAll('.tab-btn')
  allTabs.forEach(function(tab) {
    tab.classList.remove('active')
  })

  // Add active class to clicked button
  if (btn) {
    btn.classList.add('active')
  }
}
// Step 6 — Ask a question about the document
function askQuestion() {
  const question = document.getElementById('questionInput').value

  // Check if question is empty
  if (question.trim() === '') {
    alert('Please type a question first!')
    return
  }

  // Show answer box with loading text
  const answerBox = document.getElementById('answerBox')
  answerBox.style.display = 'block'
  answerBox.textContent = '🤖 Thinking...'

  // For now — fake answer (real AI answer comes when backend is ready)
  setTimeout(function() {
    answerBox.textContent = '🤖 AI answer will appear here once backend is connected!'
  }, 1500)
}

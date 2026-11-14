export function switchTheme () {

  const themeToggle = document.querySelector('#theme-toggle')
  const root = document.documentElement
  
  const savedTheme = localStorage.getItem('theme') || 'dark'
  
  root.dataset.theme = savedTheme
  
  themeToggle.checked = savedTheme === 'light'
  
  themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'light': 'dark'
    root.dataset.theme = theme
    
    localStorage.setItem('theme', theme)
  })
}
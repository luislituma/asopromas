import { useState } from 'react'
import asopromasLogo from './assets/icons/logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://asopromas.com" target="_blank">
          <img src={asopromasLogo} className="logo" alt="Asopromas logo" />
        </a>
        
      </div>
      <h1>Asopromas</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Visits today: {count}
        </button>
        <p>
          Content is coming...
        </p>
      </div>
      <p className="read-the-docs">
        Soon! Here all Asopromas documentation will be available.
      </p>
    </>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sample from './components/demo.jpg'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="image-container">
      <img
        src={Sample}
        alt="Sample"
        className="swipe-image"
        style={{height:"30vh"}}
      />
    </div>
    </>
  )
}

export default App

import Homepage from './Homepage'
import Navbar from './Navbar'
import './index.css'
import { useState, useEffect } from 'react'

function App() {
    const [authenticated, setAuthenticated] = useState(false)
  return (
    <div id="app-bg" className="px-72 w-screen h-screen flex items-center flex-col">
        <Navbar />
        <Homepage authenticated={authenticated}/>
    </div>
  )
}

export default App

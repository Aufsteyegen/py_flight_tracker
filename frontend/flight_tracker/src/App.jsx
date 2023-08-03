import Homepage from './Homepage'
import Navbar from './Navbar'
import './index.css'
import { useState, useEffect } from 'react'

function App() {
    const [authenticated, setAuthenticated] = useState(false)
    const [trackingFlight, setTrackingFlight] = useState(false)
    const [journal, setJournal] = useState([])
    const [email, setEmail] = useState('')
  return (
    <div id="app-bg" className="w-screen h-screen flex items-center flex-col overflow-scroll">
        <Navbar trackingFlight={trackingFlight} authenticated={authenticated} 
                setAuthenticated={setAuthenticated} journal={journal}
                email={email} setEmail={setEmail} setJournal={setJournal}
        />
        <Homepage trackingFlight={trackingFlight} setTrackingFlight={setTrackingFlight} 
                  authenticated={authenticated} journal={journal} setJournal={setJournal}
                  email={email} setEmail={setEmail} 
        />
    </div>
  )
}

export default App

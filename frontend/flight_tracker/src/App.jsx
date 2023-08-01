import Homepage from './Homepage'
import Navbar from './Navbar'
import './index.css'
import { useState, useEffect } from 'react'

function App() {
    const [authenticated, setAuthenticated] = useState(false)
    const [trackFlight, setTrackFlight] = useState(false)
    const [journal, setJournal] = useState([])
  return (
    <div id="app-bg" className="w-screen h-screen flex items-center flex-col overflow-scroll">
        <Navbar trackFlight={trackFlight} authenticated={authenticated} setAuthenticated={setAuthenticated} journal={journal}/>
        <Homepage trackFlight={trackFlight} setTrackFlight={setTrackFlight} 
                  authenticated={authenticated} journal={journal} setJournal={setJournal}/>
    </div>
  )
}

export default App

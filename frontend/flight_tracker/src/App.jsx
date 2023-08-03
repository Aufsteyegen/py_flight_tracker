import Homepage from './Homepage'
import Navbar from './Navbar'
import './index.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react"


function App() {
    const [authenticated, setAuthenticated] = useState(false)
    const [trackingFlight, setTrackingFlight] = useState(false)
    const [journal, setJournal] = useState([])
    const [email, setEmail] = useState('')

    const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0()

    async function syncData() {
        let syncedJournal = {}
        for (const item of journal) {
            console.log('journal of synced entered')
            const flightTime = item.flight_time[0] * 60 + item.flight_time[1]
            const originCoordinates = Object.prototype.hasOwnProperty.call(item, 'origin_coordinates') ? item.origin_coordinates : [0, 0]
            const destinationCoordinates = Object.prototype.hasOwnProperty.call(item, 'destination_coordinates') ? item.destination_coordinates : [0, 0]
            const flightRecord = {
                flight_id: item.id,
                callsign: item.callsign,
                origin: item.departure,
                arrival: item.arrival,
                aircraft_type: item.aircraft,
                aircraft_tail: item.tail,
                distance: item.distance,
                track: item.track,
                flight_time: flightTime,
                flight_date : item.flight_date,
                live : item.live,
                email : user.email,
                time_stamp :  item.time_stamp,
                origin_coordinates : originCoordinates,
                destination_coordinates : destinationCoordinates
            }
            syncedJournal[item.id] = flightRecord
            console.log(flightRecord)
        }   
        try {
            if (Object.keys(syncedJournal).length === 0) syncedJournal = {email : user.email }
            console.log(syncedJournal)
            const syncedData = await axios.put('http://127.0.0.1:8000/update/sync_flights', { params: syncedJournal })
            //setJournal(syncedData.data)
            //console.log(syncedData.data)
            console.log(syncedData)
        } catch (error) {
            console.error('Error syncing data:', error)
        }
    }

    useEffect(() => {
        const checkAuth = isAuthenticated
        if (checkAuth || typeof user !== 'undefined') {
            console.log('w')
            const userEmail = user.email
            setEmail(userEmail)
            setAuthenticated(true)
            journal.map((item) => {return {...item, email : userEmail}})
        }
        else {setAuthenticated(false), console.log('unauthenticatde user')}
    }, [isAuthenticated, journal])

  return (
    <div id="app-bg" className="w-screen h-screen flex items-center flex-col overflow-scroll">
        <Navbar trackingFlight={trackingFlight} authenticated={authenticated} 
                setAuthenticated={setAuthenticated} journal={journal}
                email={email} setEmail={setEmail} setJournal={setJournal}
                syncData={syncData}/>
        <Homepage trackingFlight={trackingFlight} setTrackingFlight={setTrackingFlight} 
                  authenticated={authenticated} journal={journal} setJournal={setJournal}
                  email={email} setEmail={setEmail} syncData={syncData}/>
    </div>
  )
}

export default App

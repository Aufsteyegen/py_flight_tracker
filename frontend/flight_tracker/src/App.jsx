import Homepage from './Homepage'
import Navbar from './Navbar'
import Footer from './Footer'
import './index.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react"

function App() {
    const [authenticated, setAuthenticated] = useState(false)
    const [trackingFlight, setTrackingFlight] = useState(false)
    const [journal, setJournal] = useState([])
    const [email, setEmail] = useState('')

    const { isAuthenticated, user } = useAuth0()

    function addJournalFlight(array, flightObject) {
        let localItem = {
            callsign : flightObject.callsign,
            departure : flightObject.origin,
            destination : flightObject.destination,
            tail : flightObject.aircraft_tail,
            flight_time : [flightObject.flight_time[0], flightObject.flight_time[1]],
            origin_coordinates : [flightObject.origin_coordinates[0], 
                                    flightObject.origin_coordinates[1]],
            destination_coordinates : [flightObject.destination_coordinates[0], 
                                        flightObject.destination_coordinates[1]],
            distance: flightObject.distance,
            id: flightObject.flight_id,
            aircraft: flightObject.aircraft_type,
            flight_date : flightObject.flight_date,
            track : flightObject.track,
            live : flightObject.live,
            status_text : '',
            email : user.email,
            time_stamp : flightObject.time_stamp
        }
        array.push(localItem)
        }

    async function syncData() {
        let syncedJournal = {}
        for (const item of journal) {
            const originCoordinates = Object.prototype.hasOwnProperty.call(item, 'origin_coordinates') ? item.origin_coordinates : [0, 0]
            const destinationCoordinates = Object.prototype.hasOwnProperty.call(item, 'destination_coordinates') ? item.destination_coordinates : [0, 0]
            const flightRecord = {
                flight_id: item.id,
                callsign: item.callsign,
                origin: item.departure,
                destination: item.destination,
                aircraft_type: item.aircraft,
                aircraft_tail: item.tail,
                distance: item.distance,
                track: item.track,
                flight_time: [item.flight_time[0], item.flight_time[1]],
                flight_date : item.flight_date,
                live : item.live,
                email : user.email,
                time_stamp :  item.time_stamp,
                origin_coordinates : originCoordinates,
                destination_coordinates : destinationCoordinates
            }
            syncedJournal = flightRecord
        }   
        try {
            if (Object.keys(syncedJournal).length === 0) syncedJournal = {email : user.email }
            const syncedData = await axios.put(`https://skyjournalapi.app/update/sync_flights`, 
                                                { params: syncedJournal })
            let syncedItems = []
            syncedData.data.map((item) => {
                addJournalFlight(syncedItems, item, 'flight_id')
            })
            setJournal(syncedItems)
        } catch (error) {
            console.error('Error syncing data:', error)
        }
    }

    useEffect(() => {
        const checkAuth = isAuthenticated
        if (checkAuth || typeof user !== 'undefined') {
             ('w')
            const userEmail = user.email
            setEmail(userEmail)
            setAuthenticated(true)
            journal.map((item) => {return {...item, email : userEmail}})
        }
        else setAuthenticated(false)
    }, [isAuthenticated, journal])

    useEffect(() => {
        if (authenticated) {
            syncData()
        }
    }, [authenticated])

  return (
    <div id="app-bg" className="w-screen h-screen flex items-center flex-col overflow-scroll">
        <Navbar trackingFlight={trackingFlight} authenticated={authenticated} 
                setAuthenticated={setAuthenticated} journal={journal}
                email={email} setEmail={setEmail} setJournal={setJournal}
                syncData={syncData}/>
        <Homepage trackingFlight={trackingFlight} setTrackingFlight={setTrackingFlight} 
                  authenticated={authenticated} journal={journal} setJournal={setJournal}
                  email={email} setEmail={setEmail} syncData={syncData}/>
        <Footer />
    </div>
  )
}

export default App

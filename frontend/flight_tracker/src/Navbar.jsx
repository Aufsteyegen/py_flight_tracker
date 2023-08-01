import './index.css'
import axios from 'axios'
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from 'react'

export default function Navbar({ authenticated, setAuthenticated, journal,
                                 trackFlight, setTrackFlight }) {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0()
    const fetchData = async () => {
        for (const item of journal) {
        const flightTime = item.flight_time[0] * 60 + item.flight_time[1]
        console.log(item)
        const databaseVals = {
            flight_id: item.id,
            callsign: item.callsign,
            origin: item.departure,
            arrival: item.arrival,
            aircraft_type: item.aircraft,
            aircraft_tail: item.tail,
            distance: item.distance,
            track: trackFlight,
            flight_time: flightTime,
            date : item.current_date,
            live : false
        }
        console.log(databaseVals)
        try {
            const returnVals = await axios.get('http://127.0.0.1:8000/api/update/', { params: databaseVals })
            console.log(returnVals, 'AHHHH')
        } catch (error) {
            console.error('Error fetching data:', error)
        }
        }
    }
    useEffect(() => {
        if (isAuthenticated) {
            setAuthenticated(true)
            fetchData()
        }
    }, [isAuthenticated])   
    return (
        <div className="text-sm bg-black flex justify-end border-b border-electric py-4 mb-8 w-1/2 px-5">
            {!authenticated && (
                <>
                    <button onClick={() => loginWithRedirect()} className="border border-electric rounded-xl px-2 py-1 mr-2">Log in</button>
                    <button onClick={() => loginWithRedirect({authorizationParams: { screen_hint: "signup", }})} className="border border-electric rounded-xl px-2 py-1 font-bold">Sign up</button>
                </>
            )}
            {authenticated && (
                <>
                     <button onClick={fetchData}>AHHHh</button>
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                             className="border border-electric rounded-xl px-2 py-1 mr-2">Log out
                    </button>
                </>
            )}
        </div>
    )
}
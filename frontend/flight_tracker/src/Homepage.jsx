import './index.css'
import Search from './Search'
import Journal from './Journal'
import { useState, useEffect } from 'react'

export default function Homepage({ authenticated }) {
    const [departure, setDeparture] = useState("")
    const [arrival, setArrival] = useState("")

    const [airline, setAirline] = useState("")
    const [flightNumber, setFlightNumber] = useState("")

    const [showIATA, setShowIATA] = useState(false)

    const [tail, setTail] = useState("")

    const [fetch, setFetch] = useState(false)
    return (
        <div className="max-w-min flex flex-col justify-center border-electric">
            <div className="flex">
                <div className="mr-8 whitespace-nowrap"><h1>Sky Journal</h1></div>
                <div><h2>Track live flights, see route statistics, log past flights, and view historical flight data from FlightRadar24—all in one place.</h2></div>
            </div>
            <div className="border-b border-electric my-5"></div>
        <Search departure={departure} setDeparture={setDeparture}
                arrival={arrival} setArrival={setArrival}
                airline={airline} setAirline={setAirline}
                flightNumber={flightNumber} setFlightNumber={setFlightNumber}
                showIATA={showIATA} setShowIATA={setShowIATA}
                fetch={fetch} setFetch={setFetch}
                tail={tail} setTail={setTail} />
        <div className="text-3xl mb-2">Journal</div>
        <div className="mb-5"><h2>View and log your past flights.</h2></div>
        <Journal authenticated={authenticated} />
        </div>
    )
}
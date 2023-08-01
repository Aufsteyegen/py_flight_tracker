import './index.css'
import Search from './Search'
import Journal from './Journal'
import { useState, useEffect } from 'react'

export default function Homepage({ authenticated, journal, setJournal,
                                   trackFlight, setTrackFlight,
                                   email, setEmail }) {
    const [departure, setDeparture] = useState("")
    const [arrival, setArrival] = useState("")

    const [airline, setAirline] = useState("")
    const [flightNumber, setFlightNumber] = useState("")

    const [tail, setTail] = useState("")

    const [inJournal, setInJournal] = useState(false)

    const [fetched, setFetched] = useState(false)
    return (
        <div className="max-w-min flex flex-col justify-center border-electric">
            <div className="flex">
                <div className="mr-8 whitespace-nowrap"><h1>Sky Journal</h1></div>
                <div className="text-2xl"><h2>Track live flights, log past flights, and see flight route statistics—all in one place.</h2></div>
            </div>
            <div className="border-b border-electric my-5"></div>
        <Search departure={departure} setDeparture={setDeparture}
                arrival={arrival} setArrival={setArrival}
                airline={airline} setAirline={setAirline}
                flightNumber={flightNumber} setFlightNumber={setFlightNumber}
                fetched={fetched} setFetched={setFetched}
                tail={tail} setTail={setTail} 
                journal={journal} setJournal={setJournal}
                inJournal={inJournal} setInJournal={setInJournal}
                authenticated={authenticated} trackFlight={trackFlight}
                setTrackFlight={setTrackFlight}
            />
        <div className="text-3xl">Journal</div>
        <div className="mb-5 text-xl"><h2>View and log past flights.</h2></div>
        <Journal authenticated={authenticated} journal={journal} setJournal={setJournal}
                 email={email} setEmail={setEmail} />
        </div>
    )
}
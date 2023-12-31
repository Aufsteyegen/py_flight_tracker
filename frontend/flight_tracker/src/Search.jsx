import axios from 'axios'
import FlightCard from './FlightCard'
import { useState } from 'react'

export default function Search({ departure, setDeparture,
                                 destination, setDestination,
                                 airline, setAirline,
                                 flightNumber, setFlightNumber,
                                 fetched, setFetched,
                                 authenticated,
                                 journal, setJournal, inJournal, setInJournal,
                                 email, trackingFlight, setTrackingFlight,
                                 logFlight, setLogFlight, syncData }) {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    async function handleSubmit(e) {
        e.preventDefault()
        const data = {
            departure: departure,
            destination: destination,
            airline: airline,
            flight_number: flightNumber
        }
        if (departure == "" || destination == "" || airline == "" || flightNumber == "") return
        try {
            setLoading(true)
            setFetched(false)
            setData({})
            const returnVals = await axios.get(`https://skyjournalapi.app/flights/`, { params: data })
            setData(returnVals.data)
            setFetched(true)
            setLoading(false)
        } catch (error) {
            if (error.response.status == 500) setError("Flight not found")
            else setError(error.message)
        }
    }
    function resetSearch() {
        setLoading(false)
        setData({})
        setError('')
    }
    return (
        <div>
            <div>
                <div className="text-3xl">Flight tracker</div>
                <div className="mb-5 text-xl">Track live and upcoming flights.</div>
                {fetched && !loading && (
                    <div className="max-h-min pb-7"><FlightCard 
                                                        data={data} setData={setData}
                                                        departure={departure}
                                                        destination={destination} authenticated={authenticated}
                                                        refresh={handleSubmit}
                                                        setLoading={setLoading} loading={loading}
                                                        setInJournal={setInJournal} inJournal={inJournal}
                                                        journal={journal} setJournal={setJournal}
                                                        setError={setError} setFetched={setFetched}
                                                        setDeparture={setDeparture}
                                                        setDestination={setDestination} setAirline={setAirline}
                                                        setFlightNumber={setFlightNumber}
                                                        email={email} trackingFlight={trackingFlight}
                                                        setTrackingFlight={setTrackingFlight}
                                                        syncData={syncData}
                    />
                    </div>
                )}
                {(loading && !error && !fetched) && (
                    <div className="flex text-3xl font-bold py-8"
                                        >Loading flight data...
                    </div>
                )}
                {error && (
                    <div className="flex flex-col py-8">
                        <div className="text-3xl">An error occurred: <span className="font-bold">{error}</span></div>
                        {error == "Flight not found" && (<div>The flight may have landed or may not be live yet.</div>)}
                        <div className="flex">
                        <div>
                            <button onClick={resetSearch} className="border border-electric rounded-xl px-2 py-1 mr-2 mt-3">New search</button>
                            <button className="border border-electric rounded-xl px-2 py-1 mr-2 mt-3" onClick={() => setLogFlight(!logFlight)}>Log manually</button></div>
                        </div>
                    </div>
                )}
                {(!loading && !fetched) && (
                <form onSubmit={handleSubmit} className="bg-electric bg-opacity-20 flex items-center justify-evenly border border-electric rounded-xl">
                    <div className="flex-col max-w-min justify-center flex rounded-xl py-3 px-6">
                    <div className="flex">
                    <div>
                        <div className="mb-2 font-bold text-white">Airline code</div>
                        <input  className="font-Inter h-12 font-bold tr-bg 
                                        text-white placeholder-gray-400 
                                        py-3 pl-3 mr-4 border bg-black 
                                        border-electric w-32 rounded-xl" 
                                name="flight-num" type="text" 
                                placeholder="DAL" 
                                value={airline}
                                onChange={(e) => {e.target.value.length <= 3 ? 
                                                setAirline(e.target.value.toUpperCase()) 
                                                : null}}
                                required/>
                        </div>

                        <div>
                            <div className="mb-2 font-bold text-white">Flight number</div>
                            <input  className="font-Inter h-12 font-bold tr-bg 
                                            text-white placeholder-gray-400 py-3 
                                            pl-3 mr-4 border bg-black 
                                            border-electric w-32 rounded-xl" 
                                    name="flight-num" type="text" 
                                    placeholder="985"
                                    value={flightNumber}
                                    onChange={(e) => {e.target.value.length <= 4 ? 
                                                    setFlightNumber(e.target.value) 
                                                    : null}}
                                    required/>
                        </div>
                   
                        <div>
                            <div className="mb-2 font-bold text-white">Departure code</div>
                            <input className="font-Inter h-12 font-bold tr-bg 
                                            text-white placeholder-gray-400 
                                            py-3 pl-3 mr-4 border bg-black 
                                            border-electric w-32 rounded-xl" 
                                    type="text" 
                                    placeholder="JFK" 
                                    value={departure}
                                    onChange={(e) => {e.target.value.length <= 3 ? 
                                                    setDeparture(e.target.value.toUpperCase()) 
                                                    : null}}
                                    required/>
                        </div>

                        <div>
                            <div className="mb-2 font-bold text-white">Arrival code</div>
                            <input  className="font-bold h-12 tr-bg text-white 
                                            placeholder-gray-400 py-3 pl-3 
                                            border bg-black border-electric 
                                            w-32 rounded-xl" name="flight-num" 
                                    type="text" 
                                    placeholder="LAX"
                                    value={destination}
                                    onChange={(e) => {e.target.value.length <= 3 ? setDestination(e.target.value.toUpperCase()) : null}}
                                    required/>
                        </div>
                    
                    </div>
                    </div>
                    <button onClick={handleSubmit} className="search-btn rounded-xl py-3"><i className='bx bx-search bx-lg flex' ></i></button>
                </form>
                )}
                <div className="border-b border-electric my-5"></div>
            </div>
        </div>
    )
}

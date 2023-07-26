import axios from 'axios'
import { useState } from 'react'

export default function Search({ showIATA, setShowIATA,
                                 departure, setDeparture,
                                 arrival, setArrival,
                                 airline, setAirline,
                                 flightNumber, setFlightNumber,
                                 fetch, setFetch,
                                 tail, setTail }) {
    const [data, setData] = useState(null)
    async function handleSubmit(e) {
        e.preventDefault()
        const data = {
            departure: departure,
            arrival: arrival,
            tail: tail,
            airline: airline,
            flight_number: flightNumber
        }
        const returnVals = await axios.get('http://127.0.0.1:8000/api/flights/', { params: data })
        console.log(returnVals)
        setData(returnVals)
        }
    
    return (
        <div>
        {!fetch && (
            <div>
                <div className="text-3xl mb-2">Track live and upcoming flights</div>
                Search by
                <div className="flex mb-2 flex-start text-sm border border-electric rounded-xl max-w-fit">
                    <button onClick={() => setShowIATA(!showIATA)} className={`mr-2 rounded-xl px-2 py-1 ${showIATA ? 'bg-green-600 font-bold shadow-lg' : 'bg-transparent'}`}>Airports</button>
                    <button onClick={() => setShowIATA(!showIATA)} className={`rounded-xl px-2 py-1 ${showIATA ? 'bg-transparent' : 'bg-green-600 font-bold shadow-lg'}`}>Flight</button>
                </div>
                <form onSubmit={handleSubmit} className="flex items-center justify-evenly border border-electric rounded-xl bg-transparent">
                    <div id="main-input" className="flex-col max-w-min justify-center flex rounded-xl py-3 px-6">
                    <div className="flex">
                    {showIATA && (
                    <>
                        <div>
                            <div className="mb-2 font-bold text-white">IATA departure code:</div>
                            <input className="font-Inter h-14 font-bold tr-bg 
                                            text-white placeholder-gray-300 
                                            py-3 pl-3 mr-4 border bg-black 
                                            border-electric w-44 rounded-xl" 
                                    type="text" 
                                    placeholder="Example: LAX" 
                                    value={departure}
                                    onChange={(e) => {e.target.value.length <= 3 ? 
                                                    setDeparture(e.target.value.toUpperCase()) 
                                                    : null}}
                                    required/>
                        </div>

                        <div>
                            <div className="mb-2 font-bold text-white">IATA arrival code:</div>
                            <input  className="font-bold h-14 tr-bg text-white 
                                            placeholder-gray-300 py-3 pl-3 mr-4 
                                            border bg-black border-electric 
                                            w-44 rounded-xl" name="flight-num" 
                                    type="text" 
                                    placeholder="Example: JFK"
                                    value={arrival}
                                    onChange={(e) => {e.target.value.length <= 3 ? setArrival(e.target.value.toUpperCase()) : null}}
                                    required/>
                        </div>

                    </>
                    )}
                    {!showIATA && (
                        <>
                            <div>
                                <div className="mb-2 font-bold text-white">ICAO airline code:</div>
                            <input  className="font-Inter h-14 font-bold tr-bg 
                                            text-white placeholder-gray-300 
                                            py-3 pl-3 mr-4 border bg-black 
                                            border-electric w-44 rounded-xl" 
                                    name="flight-num" type="text" 
                                    placeholder="Example: DAL" 
                                    value={airline}
                                    onChange={(e) => {e.target.value.length <= 3 ? 
                                                    setAirline(e.target.value.toUpperCase()) 
                                                    : null}}
                                    required/>
                            </div>

                            <div>
                                <div className="mb-2 font-bold text-white">Flight number:</div>
                            <input  className="font-Inter h-14 font-bold tr-bg 
                                            text-white placeholder-gray-300 py-3 
                                            pl-3 mr-4 border bg-black 
                                            border-electric w-44 rounded-xl" 
                                    name="flight-num" type="text" 
                                    placeholder="Example: 2382"
                                    value={flightNumber}
                                    onChange={(e) => {e.target.value.length <= 4 ? 
                                                    setFlightNumber(e.target.value) 
                                                    : null}}
                                    required/>
                            </div>
                        </>
                    )}

                    <div>
                        <div className="mb-2 font-bold text-white">Tail number (optional):</div>
                        <input  className="font-bold h-14 tr-bg text-white 
                                        placeholder-gray-300 py-3 pl-3
                                        border bg-black border-electric 
                                        w-44 rounded-xl" name="flight-num" 
                                type="text" 
                                placeholder="Example: N801AC"
                                value={tail}
                                onChange={(e) => {e.target.value.length <= 8 ? setTail(e.target.value.toUpperCase()) : null}}
                                required/>
                    </div>
                    </div>
                    </div>
                    <button onClick={handleSubmit} className="search-btn rounded-xl py-3"><i className='bx bx-search bx-lg flex' ></i></button>
                </form>
                <div className="border-b border-electric my-5"></div>
            </div>
        )}   
        </div>
    )
}
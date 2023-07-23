import './index.css'
import { useState, useEffect } from 'react'

export default function Homepage() {
    const [departure, setDeparture] = useState("")
    const [arrival, setArrival] = useState("")

    const [airline, setAirline] = useState("")
    const [flightNumber, setFlightNumber] = useState("")

    const [date, setDate] = useState("")
    const [showIATA, setShowIATA] = useState(false)
    return (
        <div className="max-w-min flex flex-col justify-center border-electric">
            <div><h2>Track live flights, see flight route statistics,  </h2></div>
            Search by
            <div className="flex mb-2 flex-start text-sm border border-electric rounded-xl max-w-fit">
                <button onClick={() => setShowIATA(!showIATA)} className={`mr-2 rounded-xl px-2 py-1 ${showIATA ? 'bg-green-600 font-bold shadow-lg' : 'bg-transparent'}`}>Airports</button>
                <button onClick={() => setShowIATA(!showIATA)} className={`rounded-xl px-2 py-1 ${showIATA ? 'bg-transparent' : 'bg-green-600 font-bold shadow-lg'}`}>Flight number</button>
            </div>
            <form className="flex items-center justify-center border border-electric rounded-xl bg-transparent">
                <div id="main-input" className="flex-col max-w-min justify-center flex rounded-xl py-3 px-3">
                <div className="flex">
                
                {showIATA && (
                <>
                    <div>
                        <div className="mb-2 font-bold text-white">IATA departure code:</div>
                        <input className="font-Inter h-14 font-bold tr-bg 
                                        text-white placeholder-gray-300 
                                          py-3 pl-3 mr-4 border bg-black 
                                          border-electric w-40 rounded-xl" 
                                type="text" 
                                placeholder="Example: LAX" 
                                value={departure}
                                onChange={(e) => {e.target.value.length <= 3 ? 
                                                  setDeparture(e.target.value.toUpperCase()) 
                                                  : null}}
                                required/>
                    </div>

                    <div>
                        <div className="mb-2 font-bold text-white">Arrival code:</div>
                        <input  className="font-bold h-14 tr-bg text-white 
                                        placeholder-gray-300 py-3 pl-3 mr-4 
                                          border bg-black border-electric 
                                          w-40 rounded-xl" name="flight-num" 
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
                                          border-electric w-40 rounded-xl" 
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
                                          border-electric w-40 rounded-xl" 
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
                    <div className="mb-2 font-bold text-white">Date (optional):</div>
                    <input  className="font-bold h-14 tr-bg text-white 
                                    placeholder-gray-300 py-3 pl-3 border 
                                      bg-black border-electric w-40 
                                      rounded-xl" name="flight-num" 
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="Date"/>
                </div>
                </div>

                    
                </div>
                
                <button className="mx-2 bg-transparent rounded-xl h-14 my-3 "><i className='bx bx-search bx-md' ></i></button>
            </form>
        </div>
    )
}
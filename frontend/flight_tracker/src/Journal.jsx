
import mapboxgl from 'mapbox-gl'
import './mapbox-gl.css'
import JournalCard from './JournalCard'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import * as turf from '@turf/turf'

mapboxgl.accessToken = import.meta.env.VITE_mapboxglAccessToken

export default function Journal({ authenticated, journal, setJournal,
                                  email, setEmail, logFlight, setLogFlight
                                }) {

    const [flightHours, setFlightHours] = useState(0)
    const [flightMiles, setFlightMiles] = useState(0)

    const [callsign, setCallsign] = useState('')
    const [tail, setTail] = useState('')
    const [departure, setDeparture] = useState('')
    const [destination, setDestination] = useState('')
    const [equipment, setEquipment] = useState('')
    const [flightTime, setFlightTime] = useState('')
    const [date, setDate] = useState('')

    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(-96)
    const [lat, setLat] = useState(37.8)
    const [zoom, setZoom] = useState(2.5)

    function updateStats() {
        let newTotalHours = 0
        let newTotalMiles = 0
        setFlightHours(0)
        setFlightMiles(0)
        journal.map((flight) => {
            const totalMinutes = (flight.flight_time[0] * 60) + flight.flight_time[1]
            const hours = (totalMinutes / 60)
            newTotalHours += hours
            newTotalMiles += flight.distance
        })
        setFlightHours(newTotalHours.toFixed(2))
        setFlightMiles(newTotalMiles)
    }

    useEffect(() => {
        updateStats()
        
    }, [journal])

    function convertMinutesToHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return [
          parseInt(hours, 10),
          parseInt(minutes, 10)
        ]       
      }

    async function createRecord() {
        const dateArray = date.split("-")

        const year = parseInt(dateArray[0], 10)
        const month = parseInt(dateArray[1], 10)
        const day = parseInt(dateArray[2], 10)

        const formattedMonth = month.toString()
        const formattedDay = day.toString()

        const convertedTime = convertMinutesToHoursAndMinutes(flightTime)
        
        const addToLocalStorage = (journalItem) => {
            const existingData = JSON.parse(localStorage.getItem('sky_journal_journal')) || []
            existingData.push(journalItem)
            localStorage.setItem('sky_journal_journal', JSON.stringify(existingData))
        }
        const data = {
            'departure_airport' : departure,
            'arrival_airport' : destination
        }
        const flightDetails = await axios.get('https://skyjournalapi.app/airports', { params: data }) 
        console.log(flightDetails)
        const timestamp = new Date()
        const timestampString = timestamp.toISOString()
        const journalItem = {
            callsign: callsign,
            departure: departure,
            destination: destination,
            tail: tail,
            flight_time: [convertedTime[0], convertedTime[1]],
            origin_coordinates: flightDetails.data.departure_coordinates,
            destination_coordinates: flightDetails.data.arrival_coordinates,
            distance: Math.round(flightDetails.data.distance),
            id: null,
            aircraft: equipment,
            flight_date: `${formattedMonth}/${formattedDay}/${year}`,
            track: false,
            live: false,
            status_text: 'Unknown',
            email: email,
            time_stamp : timestampString
        }
        addToLocalStorage(journalItem)
        setJournal((prevJournal) => [...prevJournal, journalItem])

        setCallsign('')
        setTail('')
        setDeparture('')
        setDestination('')
        setEquipment('')
        setFlightTime('')
        setDate('')
    }
          
    
    useEffect(() => {
        // Helper function to generate LineString feature between origin and destination coordinates
        const generateLine = (origin, destination) => {
          const start = turf.point(origin)
          const end = turf.point(destination)
          const line = turf.greatCircle(start, end)
      
          // Create separate features for start and end points
          const startPointFeature = turf.point(origin)
          const endPointFeature = turf.point(destination)
      
          return { line, startPointFeature, endPointFeature }
        }
      
        const features = journal.map((obj) =>
          generateLine(obj.origin_coordinates, obj.destination_coordinates)
        )
      
        if (!map.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom,
        })
      
        map.current.on('style.load', function () {
            map.current.addSource('multiple-lines-source', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: features.flatMap((item) => [item.line, item.startPointFeature, item.endPointFeature]),
              },
        })
      
        map.current.addLayer({
              id: 'multiple-lines-layer',
              type: 'line',
              source: 'multiple-lines-source',
              layout: {},
              paint: {
                'line-color': '#00C000',
                'line-width': 2,
              },
        })
      
            // Add circles at the start and end of each line
        map.current.addLayer({
              id: 'start-point-layer',
              type: 'circle',
              source: 'multiple-lines-source',
              filter: ['==', '$type', 'Point'],
              paint: {
                'circle-color': '#ADD8E6',
                'circle-radius': 4.5,
              },
        })
      
        map.current.addLayer({
              id: 'end-point-layer',
              type: 'circle',
              source: 'multiple-lines-source',
              filter: ['==', '$type', 'Point'],
              paint: {
                'circle-color': '#ADD8E6',
                'circle-radius': 4.5,
              },
        })
          })
        } else {
          // wait for map style to be loaded before updating data
            const waitForStyleLoad = setInterval(() => {
                if (map.current.isStyleLoaded()) {
                    clearInterval(waitForStyleLoad)
                    map.current.getSource('multiple-lines-source').setData({
                        type: 'FeatureCollection',
                        features: features.flatMap((item) => [item.line, item.startPointFeature, item.endPointFeature]),
                })
            }
          }, 200)
        }
    }, [journal])

    useEffect(() => {
        const local_journal = localStorage.getItem('sky_journal_journal')
        if (local_journal != null) {
            const parsed_journal = JSON.parse(local_journal)
            setJournal(parsed_journal)
        }
    }, [])
    return (
        <div>
        {!authenticated && (
            <div className="mb-2 flex justify-between">
                <div>Your data may be erased. Sign in to save it.</div>
            </div>
        )}
        <div>
                <button className="mb-2 border border-electric rounded-xl px-2 py-1 font-bold" onClick={() => setLogFlight(!logFlight)}>Log a flight</button>
        </div>
        {logFlight && (
        <div className="flex justify-center">
            <div className="mb-5 bg-electric border border-electric rounded-xl 
                            p-3 flex flex-col shadow-black shadow-md bg-opacity-20 ">
                <div className="flex justify-between">
                    <div className="text-xl"><h2>Enter flight details</h2></div>
                    <div>
                        <button title="Cancel record creation" 
                                    className="flex items-center border h-7
                                            border-electric rounded-xl" onClick={() => setLogFlight(false)}>
                                    <i className='bx bx-x'></i>
                        </button>
                    </div>
                </div>
                <div className="justify-center items-center grid grid-cols-4 gap-3">
                  
                
                    <div className="flex flex-col">
                        <div className="mb-2 mt-3 font-bold text-white">Callsign<span className="text-red-600">*</span></div>
                        <input className="font-Inter h-12 font-bold tr-bg 
                                    text-white placeholder-gray-400 
                                    pl-3 border bg-black 
                                    border-electric w-36 rounded-xl" placeholder="CPA384"
                                    value={callsign} onChange={(e) => {e.target.value.length < 8 ? setCallsign(e.target.value.toUpperCase()) : ''}}
                                    required>
                        </input>
                    </div>
                    <div className="flex flex-col">
                        <div className="mb-2 font-bold text-white mt-3">Departure<span className="text-red-600">*</span></div>
                        <input className="font-Inter h-12 font-bold tr-bg 
                                    text-white placeholder-gray-400 
                                    pl-3 border bg-black 
                                    border-electric w-36 rounded-xl" placeholder="HKG"
                                value={departure} onChange={(e) => {e.target.value.length > 3 ? '' : setDeparture(e.target.value.toUpperCase())}}
                                required>
                        </input>
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-2 font-bold text-white mt-3">Arrival<span className="text-red-600">*</span></div>
                        <input className="font-Inter h-12 font-bold tr-bg 
                                    text-white placeholder-gray-400 
                                    pl-3 border bg-black 
                                    border-electric w-36 rounded-xl" placeholder="SFO"
                                value={destination} onChange={(e) => {e.target.value.length > 3 ? '' : setDestination(e.target.value.toUpperCase())}}
                                required>
                        </input>
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-2 font-bold text-white mt-3 w-32">Date<span className="text-red-600">*</span></div>
                        <input className="font-Inter h-12 font-bold tr-bg 
                                    text-white placeholder-gray-400 
                                    pl-3 border bg-black 
                                    border-electric rounded-xl w-36" type="date" placeholder="8/1/2023"
                                    required
                                    value={date} onChange={(e) => {setDate(e.target.value)}}>
                        </input>
                    </div>
              
                    <div className="flex flex-col">
                        <div className="mb-2 font-bold text-white mt-3">Equipment</div>
                        <input className="font-Inter h-12 font-bold tr-bg 
                                    text-white placeholder-gray-400 
                                    pl-3 border bg-black 
                                    border-electric w-36 rounded-xl" placeholder="Boeing 777"
                                    value={equipment} onChange={(e) => setEquipment(e.target.value)}
                                    required>
                        </input>
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-2 font-bold text-white mt-3">Flight time (min)</div>
                        <input className="font-Inter h-12 font-bold tr-bg 
                                    text-white placeholder-gray-400 
                                    pl-3 border bg-black 
                                    border-electric w-36 rounded-xl" placeholder="731"
                                    value={flightTime} onChange={(e) => {
                                        const inputNumber = parseFloat(e.target.value)
                                        if (!isNaN(inputNumber) && Math.abs(inputNumber).toString().length <= 4) {
                                        setFlightTime(inputNumber)
                                        } else if (e.target.value === '') {
                                        setFlightTime('')
                                        }
                                    }}
                                    required>
                        </input>
                    </div>
                 
                    <div className="flex flex-col">
                        <div className="mb-2 mt-3 font-bold text-white">Registration</div>
                        <input className="font-Inter h-12 font-bold tr-bg 
                                    text-white placeholder-gray-400 
                                    pl-3 border bg-black 
                                    border-electric w-36 rounded-xl" placeholder="B-KPZ"
                                    value={tail}
                                    onChange={(e) => {e.target.value.length < 10 ? setTail(e.target.value.toUpperCase()) : ''}}
                                    required>
                        </input>
                    </div>

                    <div className="mt-auto">
                    <div className="font-bold flex items-end">
                        <button title="Submit record creation"
                            id={`${departure.length < 3 || destination.length < 3 ||
                                   callsign.length < 4 || date.length < 10
                                   ? 'disabled' : ''}`}
                            className={`flex items-center border w-full 
                                        ${departure.length < 3 ||
                                          destination.length < 3 ||
                                          callsign.length < 4 || date.length < 10 
                                          ? 'border-gray-500'
                                          : 'border-electric'} rounded-xl  
                                    h-12 px-2 py-1 text-center justify-center`}
                                    onClick={createRecord}
                                    disabled={(departure.length < 3 ||
                                                destination.length < 3 ||
                                                callsign.length < 4
                                                || date.length < 10) 
                                                ? true 
                                                : false}>Submit
                        </button>
                    </div>
                    </div>
                     
                </div>
               
            </div>
        </div>     
        )}
        <div className="mb-5 max-h-80 overflow-y-scroll grid grid-cols-2 gap-4 border-b border-electric">
            {journal.length === 0 && (
                <div className="mb-5">You have logged no flights.</div>
            )}
            {journal.map((item, index) => {
                return (
                <JournalCard item={item} journal={journal} setJournal={setJournal} 
                             key={index} email={email} setEmail={setEmail}
                />
            )
            })}
        </div>
        <div className="flex text-2xl mb-3 justify-between">
            <div><span className="font-bold">{flightHours}</span> hours,  
                <span className="font-bold"> {flightMiles}</span> miles flown over 
                <span className="font-bold"> {journal.length}</span> {journal.length != 1 ? 'flights' : 'flight'}
            </div>
            
            <div className="text-sm">
                BETA
            </div>
        </div>
        <div ref={mapContainer} className="map cursor-grab"></div>
        </div>
    )
}

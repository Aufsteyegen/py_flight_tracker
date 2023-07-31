
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './mapbox-gl.css'
import JournalCard from './JournalCard'
import { useRef, useState, useEffect } from 'react'

mapboxgl.accessToken = import.meta.env.VITE_mapboxglAccessToken

function generateLine(destination, arrival) {
    return (
        {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': [destination, arrival]
            }
          }
    )
}

export default function Journal({ authenticated, journal, setJournal }) {
    const [flightHours, setFlightHours] = useState(0)
    const [flightMiles, setFlightMiles] = useState(0)
    console.log(journal)
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(-96)
    const [lat, setLat] = useState(37.8)
    const [zoom, setZoom] = useState(2.5)  
    useEffect(() => {
        let newTotalHours = 0
        let newTotalMiles = 0
        journal.map((flight) => {
            const totalMinutes = (flight.flight_time[0] * 60) + flight.flight_time[1]
            newTotalHours += (totalMinutes / 60) + flightHours
            newTotalMiles += flight.distance
        })
        newTotalHours = parseInt(newTotalHours)
        setFlightHours(newTotalHours)
        setFlightMiles(newTotalMiles)
    }, [journal])
    
    useEffect(() => {
        const features = journal.map((obj) => generateLine(obj.destination_coordinates, obj.origin_coordinates));
        console.log(features)
    
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
                features: features,
              },
            })
    
            map.current.addLayer({
              id: 'multiple-lines-layer',
              type: 'line',
              source: 'multiple-lines-source',
              layout: {},
              paint: {
                'line-color': '#00C000',
                'line-width': 2
              },
            })
          })
        } else {
          // wait for  map style to be loaded before updating data
          const waitForStyleLoad = setInterval(() => {
            if (map.current.isStyleLoaded()) {
              clearInterval(waitForStyleLoad)
              map.current.getSource('multiple-lines-source').setData({
                type: 'FeatureCollection',
                features: features,
              })
            }
          }, 100)
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
                <button className="mb-2 border border-electric rounded-xl px-2 py-1 font-bold">Log a flight</button>
        </div>
        <div className="mb-5 max-h-80 overflow-y-scroll grid grid-cols-2 gap-4 border-b border-electric">
            {journal.length === 0 && (
                <div className="mb-5">You've logged no flights.</div>
            )}
            {journal.map((item, index) => {
                return (
                <JournalCard item={item} journal={journal} setJournal={setJournal} 
                             key={index} 
                />
            )
            })}
        </div>
        <div className="flex text-2xl mb-3">
            <div><span className="font-bold">{flightHours}</span> hours,  
                <span className="font-bold"> {flightMiles}</span> miles flown over 
                <span className="font-bold"> {journal.length}</span> {journal.length != 1 ? 'flights' : 'flight'}</div>
        </div>
        <div ref={mapContainer} className="map cursor-grab"></div>
        </div>
    )
}
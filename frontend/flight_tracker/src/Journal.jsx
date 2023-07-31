
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './mapbox-gl.css'
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
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(-96)
    const [lat, setLat] = useState(37.8)
    const [zoom, setZoom] = useState(2.5)            
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
      }, [journal, lng, lat, zoom])
    
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
                <div>
                <button className="border border-electric rounded-xl px-2 py-1 font-bold">Log a flight</button>
                </div>
            </div>
        )}
        <div className="mb-5 max-h-72 overflow-y-scroll grid grid-cols-2 gap-4">
            {journal.map((item, key) => {
                return (
                <div className="bg-black border border-electric rounded-xl p-3 flex mb-2 shadow-2xl" key={key}>
                    <div className="flex flex-col w-full">
                        <div className="flex">
                            <div className="text-3xl font-bold mr-3">{item.callsign}</div>
                            <div className="text-3xl">{item.departure}–{item.arrival}</div>
                        </div>
                        <div className="flex">
                            <div className="text-2xl mr-3">{item.aircraft}</div>
                            <div className="text-2xl">{item.tail}</div>
                            
                        </div>
                        <div className="flex mt-3 justify-between">
                            <div className="flex">
                                <div className="mr-3">{item.distance} mi</div>
                                <div>{item.flight_time[0]}h{item.flight_time[1]}m</div>
                            </div>
                            <div>{item.month}/{item.day}/{item.year}</div>
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
        <div className="flex text-2xl mb-3">
            <div className="mr-7">Hours flown:</div>
            <div>Distance flown:</div>
        </div>
        <div ref={mapContainer} className="map cursor-grab"></div>
        </div>
    )
}

import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './mapbox-gl.css'
import './index.css'
mapboxgl.accessToken = import.meta.env.VITE_mapboxglAccessToken


export default function FlightCard({ data, departure, arrival, refresh, 
                                     setLoading, authenticated, journal, setJournal,
                                     inJournal, setInJournal }) {
    const mapContainer2 = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(data.trail[0][0])
    const [lat, setLat] = useState(data.trail[0][1])
    const [zoom, setZoom] = useState(6)
    const currentDate = new Date()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()
    const year = currentDate.getFullYear()
    const journalItem = {
        callsign : data.callsign,
        departure : departure,
        arrival : arrival,
        tail : data.registration,
        flight_time : [data.flight_time[0], data.flight_time[1]],
        origin_coordinates : [data.origin_stats.longitude, data.origin_stats.latitude],
        destination_coordinates : [data.destination_stats.longitude, data.destination_stats.latitude],
        distance: data.flight_distance,
        month: month,
        day: day, 
        year: year,
        id: data.id,
        aircraft: data.aircraft
    }
    function updateJournal(e) {
        e.preventDefault()
        setJournal(prevJournal => [...prevJournal, journalItem])
    }
    useEffect(() => {
        journal.map((item) => {
            if (item.id === data.id) {
                setInJournal(true)
                return
            }
            else setInJournal(false)
        })
        const json_journal = JSON.stringify(journal)
        localStorage.setItem('sky_journal_journal', json_journal)
    }, [journal])

    useEffect(() => {
        console.log(data.trail)
        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer2.current,
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [lng, lat],
                zoom: zoom
            })
            map.current.on('load', () => {
                map.current.addSource('route', {
                    'type': 'geojson',
                    'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                    'type': 'LineString',
                    'coordinates': data.trail
                    }}
                })
                map.current.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                    },
                    'paint': {
                    'line-color': '#00C000',
                    'line-width': 2
                    }
                })
                map.current.addLayer({
                    'id': 'point2',
                    'type': 'circle',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [data.destination_stats.longitude, 
                                                data.destination_stats.latitude]
                            }
                        }
                    },
                    'paint': {
                        'circle-color': '#ADD8E6',
                        'circle-radius': 4.5
                    }
                })
                map.current.addLayer({
                    'id': 'point1',
                    'type': 'circle',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [data.origin_stats.longitude, 
                                                data.origin_stats.latitude]
                            }
                        }
                    },
                    'paint': {
                        'circle-color': '#ADD8E6',
                        'circle-radius': 4.5
                    }
                })
                map.current.addLayer({
                    'id': 'point3',
                    'type': 'circle',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': data.trail[0]
                            }
                        }
                    },
                    'paint': {
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#00FF80',
                        'circle-radius': 4
                    }
                })
            })
        }
    }, [data.trail, lat, lng, zoom])

    function padWithZeros(num) {
        return num.toString().padStart(2, '0')
    }

    function setNotifications() {

    }

    return (
        <div className="flex flex-col border border-electric rounded-xl bg-black pb-3 justify-between">
            <div className="flex justify-between px-3 rounded-xl py-3 bg-black">
                <div className="flex flex-col">
                    <div className="flex">
                        <div className="text-3xl font-bold mr-3">{data.callsign}</div>
                        <div className="text-3xl">{departure}–{arrival}</div>
                    </div>
                    <div className="flex">
                        <div className="text-2xl mr-3">{data.aircraft}</div>
                        <div className="text-2xl">{data.registration}</div>
                    </div>
                    <div className="mt-3">
                        <div>Status: {data.estimated} <span style={{color: `${data.icon_color != undefined ? data.icon_color : `gray`}`}}>●</span></div>
                        <div className="flex">
                            <div className="mr-3">Flight time: {padWithZeros(data.flight_time[0])}:{padWithZeros(data.flight_time[1])}</div>
                            <div>Distance: {data.flight_distance} mi</div>
                        </div>
                        <div className="flex">
                            <div className="mr-3">Altitude: {data.altitude} ft</div>
                            <div className="mr-3">Heading: {data.heading}°</div>
                            <div>Speed: {data.speed} kts</div>
                            
                        </div>
                        <div className="flex">
                            <div className="mt-3 mr-3 flex items-center">Last updated: {data.updated} UTC</div>
                            {!inJournal &&  (
                                <button title="Add flight to log" 
                                        className="flex justify-items-start border 
                                                border-electric rounded-xl mr-2 
                                                mt-3 h-7 px-2 font-bold"
                                        onClick={updateJournal}>+
                                </button>
                            )}
                            {inJournal &&  (
                                <button title="Flight already logged" onClick={refresh} 
                                id="disabled" className="flex items-center border 
                                border-gray-500 rounded-xl mr-2 
                                           mt-3 h-7 " disabled>
                                    <i className='bx bx-check bx-xs'></i>
                                </button>
                            )}
                            <button title="Refresh flight data" onClick={refresh} 
                                    className="flex items-center border 
                                             border-electric rounded-xl mr-2 
                                               mt-3 h-7">
                                    <i className='bx bx-refresh bx-xs'></i>
                            </button>
                            {authenticated && (
                            <button title="Get live notifications" onClick={setNotifications} 
                                    className="flex items-center border 
                                             border-electric rounded-xl mr-2 
                                               mt-3 h-7">
                                    <i className='bx bxs-bell bx-xs'></i>
                            </button>
                            )}
                            {!authenticated && (
                            <button id="disabled" title="Log in to get live notifications" 
                                    className="flex items-center border 
                                             border-gray-500 rounded-xl mr-2 
                                               mt-3 h-7" disabled>
                                    <i className='bx bxs-bell'></i>
                            </button>
                            )}
                            <button title="Start new search" 
                                    className="flex justify-center items-center border 
                                             border-electric rounded-xl mr-2 
                                               mt-3 h-7 px-2 font-bold text-sm">New search
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-72 relative">
                    <img className="rounded-t-xl shadow-md" src={data.image}/>
                    <div className="text-xs absolute bottom-0 w-full bg-electric  text-white rounded-b-xl py-1 pl-2">
                    © <span className="font-bold">{data.image_credit}</span> JetPhotos.com
                    </div>
                </div>
            </div>
            <div ref={mapContainer2} className="map w-52 cursor-grab mt-3"></div>
        </div>
    )
}
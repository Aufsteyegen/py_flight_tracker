
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './mapbox-gl.css'
mapboxgl.accessToken = import.meta.env.VITE_mapboxglAccessToken


export default function FlightCard({ data, departure, arrival }) {
    const mapContainer2 = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(data.trail[0][0])
    const [lat, setLat] = useState(data.trail[0][1])
    const [zoom, setZoom] = useState(4)
    useEffect(() => {
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
                    'line-color': '#0059B2',
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
                        'circle-color': '#00FF80',
                        'circle-radius': 4
                    }
                })
                
            })
        }
    }, [data.trail, lat, lng, zoom])

    function padWithZeros(num) {
        return num.toString().padStart(2, '0')
    }

    return (
        <div className="flex flex-col border border-electric rounded-xl bg-black py-3 justify-between">
            <div className="flex justify-between px-3">
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
                        <div>Status: {data.estimated} <span className={`text-${data.icon_color != undefined ? data.icon_color : `gray`}-500`}>●</span></div>
                        <div>Flight time: {padWithZeros(data.flight_time[0])}:{padWithZeros(data.flight_time[1])}</div>
                        <div className="flex">
                            <div className="mr-3">Altitude: {data.altitude} ft</div>
                            <div className="mr-3">Heading: {data.heading}°</div>
                            <div>Speed: {data.speed} kts</div></div>
                    </div>
                </div>
                <div className="w-72 relative">
                    <img className="rounded-xl" src={data.image}/>
                    <div className="text-xs absolute bottom-0 w-full bg-black bg-opacity-10 text-white rounded-b-xl py-1 pl-2">
                    © <span className="font-bold">{data.image_credit}</span> JetPhotos.com
                    </div>
                </div>
                </div>
            <div ref={mapContainer2} className="map w-52 cursor-grab mt-3" ></div>
        </div>
    )
}
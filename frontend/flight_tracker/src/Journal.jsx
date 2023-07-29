
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './mapbox-gl.css'
import { useRef, useState, useEffect } from 'react'

mapboxgl.accessToken = import.meta.env.VITE_mapboxglAccessToken

export default function Journal({ authenticated }) {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(-96)
    const [lat, setLat] = useState(37.8)
    const [zoom, setZoom] = useState(2.5)
    useEffect(() => {
        if (map.current) return
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [lng, lat],
        zoom: zoom
        })
    })
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
        <div ref={mapContainer} className="map">

        </div>
        </div>
    )
}


export default function FlightCard({ data, departure, arrival }) {
    return (
        <div className="flex border border-electric rounded-xl bg-black px-6 py-3 justify-between">
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
                <div>Status: {data.estimated}</div>
                <div>Altitude: {data.altitude}</div>
                <div>Flight time: {data.flight_time[0]}:{data.flight_time[1]}</div>
            </div>
            </div>
            <div className="w-72">
            <img className="rounded-xl" src={data.image}/>
            </div>
        </div>
    )
}
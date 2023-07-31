

export default function JournalCard({ item }) {
    return (
        <div className="mb-5 bg-electric border border-electric rounded-xl p-3 flex mb-2 shadow-black shadow-md bg-opacity-20">
            <div className="flex flex-col w-full">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="text-3xl font-bold mr-3">{item.callsign}</div>
                        <div className="text-3xl">{item.departure}–{item.arrival}</div>
                    </div>
                    
                    <div className="font-bold"><button title="Delete flight from log" 
                                    className="flex items-center border 
                                             border-electric rounded-xl  
                                               h-7">
                                    <i className='bx bx-x'></i>
                        </button>
                    </div>
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
}
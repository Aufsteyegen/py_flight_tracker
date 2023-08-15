

import { useState } from 'react'
import axios from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.xsrfCookieName = "csrftoken"
axios.defaults.withCredentials = true

export default function JournalCard({ item, journal, setJournal,
                                      email }) {
                    
    const [confirmDelete, setConfirmDelete] = useState(false)
      
    async function handleDelete(e) {
        e.preventDefault()
        const deleteItem = {
            email : email,
            time_stamp : item.time_stamp,
            id : item.id
        }
        try {
            await axios({
                method:'delete', 
                url: `https://skyjournalapi.app/update/delete_flight`, 
                data: deleteItem,
            })
            const newArray = journal.filter((flightItem) => flightItem.time_stamp !== item.time_stamp)
            setJournal(newArray)
            const json_journal = JSON.stringify(newArray)
            localStorage.setItem('sky_journal_journal', json_journal)
            setConfirmDelete(false)
        } catch (error) {
             (error)
        }
    }

    return (
        <div className="mb-5 bg-electric border border-electric rounded-xl p-3 flex mb-2 shadow-black shadow-md bg-opacity-20">
            <div className="flex flex-col w-full">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="text-3xl font-bold mr-3">{item.callsign}</div>
                        <div className="text-3xl">{item.departure}–{item.destination}</div>
                    </div>
                    {!confirmDelete && (
                    <div className="font-bold"><button title="Delete flight from log" 
                                    className="flex items-center border 
                                             border-electric rounded-xl  
                                               h-7" onClick={() => setConfirmDelete(true)}>
                                    <i className='bx bx-x'></i>
                        </button>
                        </div>
                    )}
                    {confirmDelete && (
                    <div className="font-bold  overflow-scroll" onClick={handleDelete}><button title="Delete flight from log" 
                                    className="flex items-center border 
                                             border-electric rounded-xl  
                                               h-7 px-2">
                                    Delete?
                        </button>
                        </div>
                    )}
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
                    <div>{item.flight_date}</div>
                </div>
            </div>
        </div>
    )
}

import './index.css'
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from 'react'

export default function Navbar({ authenticated, setAuthenticated, journal,
                                 trackFlight, setEmail, setJournal }) {
    const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0()
    useEffect(() => {
        const checkAuth = isAuthenticated
        if (checkAuth) {
            const userEmail = user.email
            setEmail(userEmail)
            setAuthenticated(true)
            journal.map((item) => {return {...item, email : userEmail}})
        }
        else setAuthenticated(false)
    }, [isAuthenticated, journal, trackFlight])
    return (
        <div className="text-sm bg-black bg-opacity-80 flex justify-between 
                        border-b border-electric py-4 mb-8 w-1/2 px-5 fixed z-30">
            <div className="flex">
            <div className="flex items-center font-bold mr-4">{typeof user !== 'undefined' 
                                                          ? user.email : 'Not signed in'}
            </div>
            <div className="flex items-center justify-center">
                V1.0.5
            </div>
            </div>
            {!authenticated && (
                <div>
                    <button onClick={() => loginWithRedirect()} className="border 
                                    border-electric rounded-xl px-2 py-1 mr-2">Log in
                    </button>
                    <button onClick={() => loginWithRedirect({authorizationParams: { screen_hint: "signup", }})} 
                                     className="border border-electric rounded-xl 
                                     px-2 py-1 font-bold">Sign up
                    </button>
                </div>
            )}
            {authenticated && (
                <>
                    <button onClick={() => {
                        logout({ logoutParams: { returnTo: window.location.origin } })
                        setJournal([])
                        localStorage.removeItem('sky_journal_journal')
                    }
                    }
                             className="border border-electric rounded-xl px-2 
                                        py-1 mr-2">Log out
                    </button>
                </>
            )}
        </div>
    )
}

import './index.css'
import { useAuth0 } from "@auth0/auth0-react"

export default function Navbar({ authenticated, setAuthenticated }) {
    const { loginWithRedirect } = useAuth0()
    const { logout } = useAuth0()
    return (
        <div className="text-sm w-full bg-black flex justify-end border-b border-electric py-4 mb-8 px-10">
            {!authenticated && (
                <>
                    <button onClick={() => loginWithRedirect()} className="border border-electric rounded-xl px-2 py-1 mr-2">Log in</button>
                    <button onClick={() => loginWithRedirect({authorizationParams: { screen_hint: "signup", }})} className="border border-electric rounded-xl px-2 py-1 font-bold">Sign up</button>
                </>
            )}
            {authenticated && (
                <>
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                             className="border border-electric rounded-xl px-2 py-1 mr-2">Log out
                    </button>
                </>
            )}
        </div>
    )
}
import './index.css'

export default function Navbar() {
    return (
        <div className="text-sm w-full bg-black flex justify-end border-b border-electric py-4 mb-8 px-10">
            <button className="border border-electric rounded-xl px-2 py-1 mr-2">Log in</button>
            <button className="border border-electric rounded-xl px-2 py-1 font-bold">Sign up</button>
        </div>
    )
}
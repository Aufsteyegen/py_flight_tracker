import './index.css'

export default function Navbar() {
    return (
        <div className="text-sm w-full bg-black pr-3 flex justify-end border-b border-electric py-4 mb-8">
            <button className="border border-electric rounded-xl px-2 py-1 mr-2">Log in</button>
            <button className="border border-electric rounded-xl px-2 py-1">Sign up</button>
        </div>
    )
}
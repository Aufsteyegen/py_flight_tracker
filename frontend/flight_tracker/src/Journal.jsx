
export default function Journal({ authenticated }) {
    return (
        <div>
        {!authenticated && (
            <div className="font-bold">
                Sign in to use this feature.
            </div>
        )}    
        </div>
    )
}
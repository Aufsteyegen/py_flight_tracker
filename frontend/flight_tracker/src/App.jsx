import Homepage from './Homepage'
import Navbar from './Navbar'
import './index.css'

function App() {

  return (
    <div id="app-bg" className="px-72 w-screen h-screen flex items-center flex-col">
        <Navbar />
        <Homepage />
    </div>
  )
}

export default App

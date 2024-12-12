import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Sidebar from './components/Sidebar'


function App() {
  const [activeChannel,setActiveChannel] = useState<string>("home");
 return(
  <BrowserRouter>
  <Sidebar setActiveChannel={setActiveChannel} activeChannel={activeChannel} />
  <Routes>
    <Route path='/' element={<Home />} />
  </Routes>
  </BrowserRouter>
  )
}

export default App

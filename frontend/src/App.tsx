import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import Menu from './components/Menu';


function App() {
  const [activeChannel,setActiveChannel] = useState<string>("home");
  const [openMenu,setOpenMenu] = useState<boolean>(true);
 return(
  <BrowserRouter>
  <div className='flex'>
  <Sidebar setActiveChannel={setActiveChannel} activeChannel={activeChannel} />
  {
    openMenu ?  <Menu /> : ""
  }
  </div>
  <Routes>
    <Route path='/' element={<Home />} />
  </Routes>
  </BrowserRouter>
  )
}

export default App

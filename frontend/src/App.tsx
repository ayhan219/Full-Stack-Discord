import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import Menu from './components/Menu';
import Channel from './pages/Channel';


function App() {
  const [activeChannel,setActiveChannel] = useState<string>("home");
  const [openMenu,setOpenMenu] = useState<boolean>(true);
  const [openTopBar,setOpenTopBar] = useState<boolean>(true);

 return(
  <BrowserRouter>
  {/* <div className='flex'>
  
  </div> */}
  <div className='flex'>
  <Sidebar setActiveChannel={setActiveChannel} activeChannel={activeChannel} />
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/channel' element={<Channel />} />
  </Routes>
  </div>
  </BrowserRouter>
  )
}

export default App

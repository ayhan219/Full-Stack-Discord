import { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import Menu from './components/Menu';
import Channel from './pages/Channel';
import Signup from './pages/Signup';
import Login from './pages/Login';


function App() {
  const [activeChannel,setActiveChannel] = useState<string>("home");
  const [user,setUser] = useState<boolean>(false);

 return(
  <BrowserRouter>
  {/* <div className='flex'>
  
  </div> */}
  <div className='flex'>
  {
    user && <Sidebar setActiveChannel={setActiveChannel} activeChannel={activeChannel} />
  }
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/channel' element={<Channel />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/login' element={<Login />} />
  </Routes>
  </div>
  </BrowserRouter>
  )
}

export default App

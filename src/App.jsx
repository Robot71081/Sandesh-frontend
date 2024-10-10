import React,{Suspense,lazy, useEffect} from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute.jsx'
import { LayoutLoader } from './components/layout/Loaders.jsx'
import axios from 'axios' 
import { server } from './components/constants/config.js'
import { useDispatch, useSelector } from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth.js'
import {Toaster} from 'react-hot-toast'
import { SocketProvider } from './socket.jsx'




const Home=lazy(()=>import("./pages/home.jsx"))
const Login=lazy(()=>import("./pages/Login.jsx"))
const Chat=lazy(()=>import("./pages/Chat.jsx"))
const Groups=lazy(()=>import("./pages/Groups.jsx"))
const NotFound=lazy(()=>import("./pages/NotFound.jsx"))



const App = () => {

  const {user,loader} =useSelector(state=>state.auth)
  const dispatch =useDispatch()
   useEffect(() => {
      //console.log(server)
        axios.get(`http://localhost:3000/api/v1/user/me`,{withCredentials:true})
            .then(({data}) => dispatch(userExists(data.user)))
            .catch((err) =>dispatch(userNotExists()));
    }, []);
  return loader ? (
    <LayoutLoader/>
  ) : (
    <BrowserRouter>
    <Suspense fallback={<LayoutLoader/>}>
    <Routes>
    <Route path='/' element={<SocketProvider>
      <ProtectRoute user={user}/>
    </SocketProvider>}>
      <Route path='/' element={<Home/>}/>
      
      <Route path='/chat/:chatid' element={<Chat/>}/>
      <Route path='/groups' element={<Groups/>}/>
    </Route>
      <Route path='/login' element={<ProtectRoute user={!user} redirect='/'><Login /></ProtectRoute>}/>


      <Route path='*' element={<NotFound/>}/>
    </Routes>
    </Suspense>
    <Toaster position="bottom-center" />
    </BrowserRouter>
   
  )
}

export default App


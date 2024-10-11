import { createContext, useContext, useMemo } from 'react'
import {io} from 'socket.io-client'


const SocketContext=createContext()
const getSocket =()=>useContext(SocketContext)

const SocketProvider =({children})=>{
    const socket =  useMemo(()=>io("https://sandesh-backend-4ql2.onrender.com",{withCredentials:true}),[])
    return (
        <SocketContext.Provider value={socket}>
        {children}
        </SocketContext.Provider>
    )
}


export {getSocket,SocketProvider}

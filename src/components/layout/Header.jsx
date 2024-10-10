import React, { Suspense, lazy, useState } from 'react'
import { FaSearch  } from "react-icons/fa"; 
import { FaUserGroup } from "react-icons/fa6";
import { IoAddSharp } from "react-icons/io5";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlinePlaylistAdd } from "react-icons/md";

import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/auth';
import { setIsMobileMenuFriend, setIsNotification, setIsSearch ,setIsNewGroup} from '../../redux/reducers/misc';
import { resetNotificationCount } from '../../redux/reducers/chat';


const Header = () => {

    const navigate=useNavigate();
    const dispatch=useDispatch()
    const Search=lazy(()=>import('../specific/Search'))
    const Noti=lazy(()=>import('../specific/Noti'))
    const NewGroup=lazy(()=>import('../specific/NewGroup'))
    const {isNewGroup}= useSelector((state)=>state.misc)

  const {isSearch}= useSelector(state=>state.misc)
  const {isNotification}= useSelector(state=>state.misc)
  const {notificationCount}= useSelector(state=>state.chat)

    
    
    
    
    
    
    const handleSearch=()=>dispatch(setIsSearch(true))
    const openGroup=()=>{
       dispatch(setIsNewGroup(true))
    }
    const navGroup=()=>navigate("/groups")

    const openNoti=()=>{
      dispatch(setIsNotification(true))
      dispatch(resetNotificationCount())
     }

     const handleButton=()=>{
      dispatch(setIsMobileMenuFriend(true))
      
   }



    const logoutHandler=async ()=>{
       try {
         const {data} = await axios.get(`http://localhost:3000/api/v1/user/logout`,{withCredentials:true})
         dispatch(userNotExists())
         toast.success(data.message)

       } catch (error) {
          toast.error(error?.response?.data?.message || "Something went wrong")
       }
      
    }

    
  return (
    <>
    <div className='flex flex-row items-center bg-blue-400 h-11 font-bold text-white text-4xl container mx-auto'>
  <div className='flex-1'>Sandesh</div>
  
  <div className='flex flex-row items-center'>
    <button className="mx-2 block sm:hidden" onClick={handleButton}>
      <MdOutlinePlaylistAdd />
    </button>
    <button className="mx-2" onClick={handleSearch}>
      <FaSearch />
    </button>
    <button className="mx-2" onClick={openGroup}>
      <IoAddSharp />
    </button>
    <button className="mx-2" onClick={navGroup}>
      <FaUserGroup />
    </button>
    <button className="relative flex items-center mx-2 p-2 bg-transparent border-none cursor-pointer" onClick={openNoti} value={notificationCount}>
      <IoIosNotifications />  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {notificationCount}
        </span>
    </button>
    <button className="mx-2" onClick={logoutHandler}>
      <RiLogoutBoxRFill />
    </button>
  </div>
</div>

       {isSearch&& <Suspense fallback={<div className='fixed inset-0 bg-black bg-opacity-50 z-40'></div>}><Search/></Suspense>}
       {isNotification&& <Suspense fallback={<div  className='fixed inset-0 bg-black bg-opacity-50 z-40'></div>}><Noti/></Suspense>}
       {isNewGroup&& <Suspense fallback={<div  className='fixed inset-0 bg-black bg-opacity-50 z-40'></div>}><NewGroup/></Suspense>}
        
      
     
    </>
  )
}

export default Header

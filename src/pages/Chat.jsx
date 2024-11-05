import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { MdAttachFile,MdSend  } from "react-icons/md";
import FileMenu from '../components/dailogs/FileMenu';
import { sampleMsg } from '../components/constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../components/constants/event';
import { useCallback } from 'react';
import { useErrors, useSocketEvents } from '../hooks/hooks';
import {useInfiniteScrollTop} from '6pp'
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMsgAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';


const Chat = ({chatId,user}) => {

  const navigate=useNavigate()
  const containerRef=useRef(null)
  const socket=getSocket()
  const dispatch=useDispatch()
  const [message,setMessage] =useState("")
  const [messages,setMessages] =useState([])
  const [page,setPage]=useState(1)
  const [typing,setTyping]=useState(false)
  const [userTyping,setUserTyping]=useState(false)
  const typingTimeout=useRef(null)

  const [fileMenuAnchor,setFileMenuAnchor]=useState(null)
 const chatDetails= useChatDetailsQuery({chatId,skip:!chatId})
 const oldMessagesChunk=useGetMessagesQuery({chatId,page})
 const bottomRef=useRef(null)


 
 const {data:oldMessages,setData:setOldMessages} =useInfiniteScrollTop(containerRef,oldMessagesChunk.data?.totalPages,page,setPage,oldMessagesChunk.data?.messages)
  
  const errors=[{isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}
  
  ]
  
  const members=chatDetails?.data?.chat?.members


  const msgOnChange =(e)=>{

    setMessage(e.target.value)
    if(!typing) {
      socket.emit(START_TYPING,{members,chatId})
      setTyping(true)
    }
    if(typingTimeout.current) clearTimeout(typingTimeout.current)
   typingTimeout.current= setTimeout(() => {
      socket.emit(STOP_TYPING,{members,chatId})
      setTyping(false)
    }, 2000);
  }
  const {isFileMenu}=useSelector((state)=>state.misc)

  const handleFileOpen =(e)=>{
    
      dispatch(setIsFileMenu(true))
      setFileMenuAnchor(e.currentTarget)
  }
  
  const submitHandler=(e)=>{
    e.preventDefault()
    if(!message.trim()) return
    
    socket.emit(NEW_MESSAGE,{chatId,members,message})
    setMessage("")

      
  }

  useEffect(()=>{
     socket.emit(CHAT_JOINED,{userId:user._id,members})
    dispatch(removeNewMsgAlert(chatId))
      return()=>{
        setMessages([])
        setMessage("")
        setOldMessages([])
        setPage(1)
        socket.emit(CHAT_LEAVED,{userId:user._id,members})
      }
  },[chatId])

  useEffect(()=>{
    if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"})
      
  },[messages])

 // useEffect(()=>{
  //  if(!chatDetails.isError) return navigate("/")
      
 // },[chatDetails.isError])
  const newMsgHandler =useCallback((data)=>{
    if(data.chatId!==chatId) return
    
    setMessages(prev=>[...prev,data.message])
  },[chatId])

  const startTypingListener =useCallback((data)=>{
    if(data.chatId!==chatId) return
     
     setUserTyping(true)
  },[chatId])

  const stopTypingListener =useCallback((data)=>{
    if(data.chatId!==chatId) return
    
     setUserTyping(false)
  },[chatId])

  const alertListener =useCallback((data)=>{
    if(data.chatId!==chatId) return
    const msgForAlert={
      content:data.message,
    
      sender:{
          _id:"sdgdfgd",
          name:"Admin"

      },
      chat:chatId,
      createdAt:new Date().toISOString()
  }
  setMessages((prev)=>[...prev,msgForAlert])
  },[chatId])

  const eventHandler={[NEW_MESSAGE]:newMsgHandler,
    [START_TYPING]:startTypingListener,
    [ALERT]:alertListener,
    [STOP_TYPING]:stopTypingListener}
  useSocketEvents(socket,eventHandler)
  useErrors(errors)

  const allMessages=[...oldMessages,...messages]
  
  
  
  
  return chatDetails.isLoading?(<div className='fixed inset-0 bg-black bg-opacity-50 z-40'></div>):(
    <>
    {/* Chat Container */}
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 overflow-auto flex-1" ref={containerRef}>
      {
        allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))
      }
      {userTyping && <TypingLoader />}
      <div ref={bottomRef} />
    </div>
    
    {/* Input Form */}
    <form className="h-auto sm:h-[10%] lg:h-[12%] flex flex-row items-center space-x-2 p-4 bg-gray-200" onSubmit={submitHandler}>
      <button onClick={handleFileOpen} type="submit" className="flex items-center justify-center relative bg-blue-500 rounded-lg p-[0.5rem] hover:bg-blue-800 text-white">
        <MdAttachFile />
      </button>
  
      <input
        type="text"
        placeholder="Enter message here"
        className="flex-grow h-full border-none outline-none p-2 rounded-3xl bg-gray-100"
        value={message}
        onChange={msgOnChange}
      />
  
      <button type="submit" className="flex items-center justify-center bg-blue-500 rounded-lg p-[0.5rem] hover:bg-blue-800 text-white">
        <MdSend />
      </button>
    </form>
  
    {/* File Menu */}
    {isFileMenu && <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />}
  </>
  
  )
}

export default AppLayout()(Chat)

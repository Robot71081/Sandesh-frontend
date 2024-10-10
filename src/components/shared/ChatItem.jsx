import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import AvatarCard from './AvatarCard'

const ChatItem = ({avatar=[],name,_id,groupChat=false,sameSender,isOnline,newMessageAlert,index=0,handleDeleteChat}) => {
  return (
   <Link to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)} className='text-black p-1 hover:bg-white'>
  <div className={`flex items-center p-4 ${sameSender ? 'bg-black text-white' : 'bg-transparent text-black'} gap-4 relative`}>
  <AvatarCard avatar={avatar} />
  <div className="relative flex-grow"> {/* Use flex-grow to allow this div to take available space */}
    <span className="block">{name}</span>
    {newMessageAlert && (
      <span className="text-black">{newMessageAlert.count} New Messages</span>
    )}
  </div>
  {isOnline && (
    <div className="w-5 h-5 rounded-full bg-green-500 absolute  right-1 " />
  )}
</div>


   </Link>
  )
}

export default memo(ChatItem)


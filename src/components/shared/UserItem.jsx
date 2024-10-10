import React,{memo} from 'react'
import { IoAddSharp } from "react-icons/io5";
import { IoMdRemoveCircleOutline } from "react-icons/io";

const UserItem = ({user,handler,handlerIsLoading,isAdded=false}) => {
    const {name,_id,avatar}=user
  return (
    
    <ul className="bg-white border border-gray-300 rounded-md shadow-md divide-y divide-gray-200 ">
   
     <li className="flex items-center justify-between  hover:bg-gray-100">
      <div className='flex space-x-5 flex-row items-center w-full '>
      <img 
    src={avatar}
    alt="User Avatar" 
    className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
  />
  <span className=' overflow-hidden text-center text-ellipsis w-full'>{name}</span>
  <button className='bg-white text-black size-4 ' onClick={()=>handler(_id)} disabled={handlerIsLoading}>
    {
      isAdded?<IoMdRemoveCircleOutline/>: <IoAddSharp/>
    }
   
    </button>
      </div>
   </li>
    
   </ul>
  )
}

export default memo(UserItem)

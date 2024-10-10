import React, { useEffect, useState } from 'react'
import {useInputValidation} from '6pp'
import UserItem from '../shared/UserItem'
import { sampleusers } from '../constants/sampleData'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/reducers/misc'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import {toast} from 'react-hot-toast'
import { useAsyncMutation } from '../../hooks/hooks'


const Search = () => {
  const dispatch=useDispatch()
  const {isSearch}= useSelector(state=>state.misc)
  const [searchUser] =useLazySearchUserQuery()
  const [sendFriendRequest,isLoadingSendFriendRequest] =useAsyncMutation(useSendFriendRequestMutation)
  const search= useInputValidation("")
  const addFriendHandler=async (id)=>{
    await  sendFriendRequest("Sending friend request ...",{userId:id})
  }
 
  const [users,setUsers]=useState([])

  const closeHandler=()=>dispatch(setIsSearch(false))

  useEffect(()=>{
const timeoutId=setTimeout(()=>{
    searchUser(search.value).then(({data})=>setUsers(data.users)).catch((e)=>console.log(e))

},1000)

return ()=>{
  clearTimeout(timeoutId)
}

  },[search.value])

  
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 overflow-hidden relative">
      <button
        onClick={closeHandler} // Add your close dialog function here
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        &times; {/* This is the close icon, you can replace it with an SVG icon if desired */}
      </button>
      
      <h2 className="text-xl font-semibold mb-4 text-center">Find People</h2>
  
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          id="textfield"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Enter text here"
          value={search.value}
          onChange={search.changeHandler}
        />
      </div>
  
      <ul className="bg-white border border-gray-300 rounded-md shadow-md divide-y divide-gray-200 mt-4 overflow-hidden max-h-60 overflow-y-auto">
        {users.map((i) => (
          <UserItem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
        ))}
      </ul>
    </div>
  </div>
  
  

  )
}

export default Search

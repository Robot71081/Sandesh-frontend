import React, { useState } from 'react'
import { sampleusers } from '../constants/sampleData'
import UserItem from '../shared/UserItem'
import {useInputValidation} from '6pp'
import { useDispatch, useSelector } from 'react-redux'
import {  useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hooks'
import { setIsNewGroup } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'

const NewGroup = () => {
  const {isNewGroup}= useSelector((state)=>state.misc)
  const dispatch=useDispatch()
  const [newGroup,isLoadingNewGroup]= useAsyncMutation(useNewGroupMutation)
  const {isError,isLoading,error,data}=useAvailableFriendsQuery()
  
  const [selectedMembers,setSelectedMembers]=useState([])

  const errors=[{
    isError,
    error
  }]

  useErrors(errors)
  const selectMemberHandler =(id)=>{
     setSelectedMembers(prev=>(prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id]))
  }
  console.log(selectedMembers)
  const submitHandler =()=>{
     if(!groupName.value) return toast.error("Group name is required")
     if(selectedMembers.length<2)  return toast.error("Please select alteast 3 members")
     newGroup("Creating new group",{name:groupName.value,members:selectedMembers})
     closedHandler()
  }
  const closedHandler=()=>{
      dispatch(setIsNewGroup(false))
  }
  const groupName=useInputValidation("")
  return (

    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col items-center relative">
      
      {/* Close Button */}
      <button 
        className="absolute top-4 right-4 text-black text-2xl hover:text-gray-900"
        onClick={closedHandler} // Ensure you define the closeHandler function
      >
        &times; {/* This is a simple close icon (X) */}
      </button>
  
      <h2 className="overflow-hidden text-xl font-semibold mb-6 text-center text-black">New Group</h2>
      
      <input
        type="text"
        id="textfield"
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4"
        placeholder="Group Name"
        value={groupName.value}
        onChange={groupName.changeHandler}
      />
      
      <span className="mb-2">Members</span>
      
      <div className="flex flex-col w-full mb-4">
        {isLoading ? (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-40'></div>
        ) : (
          data?.friends?.map((i) => (
            <UserItem 
              user={i} 
              key={i._id} 
              handler={selectMemberHandler} 
              isAdded={selectedMembers.includes(i._id)} 
            />
          ))
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row w-full ">
        <button className="bg-red-700 text-white rounded-md w-full sm:w-auto mb-2 sm:mb-0" onClick={closedHandler}>
          Cancel
        </button>
        <button className="bg-green-500 text-white rounded-md w-full sm:w-auto" onClick={submitHandler} disabled={isLoadingNewGroup}>
          Create
        </button>
      </div>
    </div>
  </div>
  
  )
}

export default NewGroup

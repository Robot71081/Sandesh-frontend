import React, { memo } from 'react'
import { sampleNoti } from '../constants/sampleData'
import { useAcceptFriendRequestMutation, useGetNotisQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'

const Noti = () => {
  const dispatch=useDispatch()
  
  const {isLoading,isError,data,error}= useGetNotisQuery()

 const [acceptRequest]= useAcceptFriendRequestMutation()
  const friendRequestHandler= async({_id,accept})=>{
    
        try {
          const res= await acceptRequest({requestId:_id,accept})
          if(res.data?.success){
            toast.success(res.data.message)
          }else{
             toast.error(res.data?.error|| "Something went wrong")
          }
        } catch (error) {
          toast.error(error.message|| "Something went wrong")
          console.log(error)
        }
  }
  const closeHandler=()=>dispatch(setIsNotification(false))

  useErrors([{error,isError}])
  return (
    
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      
    
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
  <button
    onClick={closeHandler} // Add your close dialog function here
    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
  >
    &times; {/* Close icon, you can replace it with an SVG icon if desired */}
  </button>

  <div className='flex flex-col p-[1rem]'>
    <h2 className="text-xl font-semibold mb-4 text-center overflow-hidden">Notifications</h2>

    {isLoading ? (
      <div className='fixed inset-0 bg-black bg-opacity-50 z-40'></div>
    ) : (
      <>
        {data?.allRequests.length > 0 ? (
          data.allRequests.map((i) => (
            <NotiItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id} />
          ))
        ) : (
          <span className='text-center'>No Notifications</span>
        )}
      </>
    )}
  </div>
</div>

    </div>
    
  )
}

const NotiItem=memo(({sender,_id,handler})=>{
  const {name,avatar}=sender
  return (
    <ul className="bg-white border border-gray-300 rounded-md shadow-md divide-y divide-gray-200">
    <li className="flex items-center justify-between hover:bg-gray-100 p-3">
      <div className="flex flex-col sm:flex-row items-center w-full">
        <img 
          src="https://via.placeholder.com/150" 
          alt="User Avatar" 
          className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover mr-3"
        />
        <span className="overflow-hidden text-center text-ellipsis w-full">{`${name} sent you a friend request`}</span>
        <div className="mt-2 sm:mt-0 flex space-x-2 sm:ml-4">
          <button className="bg-green-600 text-white rounded-lg px-3 py-1" onClick={() => handler({_id, accept: true})}>Accept</button>
          <button className="bg-red-600 text-white rounded-lg px-3 py-1" onClick={() => handler({_id, accept: false})}>Reject</button>
        </div>
      </div>
    </li>
  </ul>
  
  )
})

export default Noti

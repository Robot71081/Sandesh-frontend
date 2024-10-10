import React from 'react'
import { FaFaceGrinWink } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import moment from 'moment'

const Profile = ({user}) => {
  return (
    <div className='flex flex-col items-center justify-center space-y-8'>
    <img 
      src={user?.avatar?.url} 
      alt="User Avatar" 
      className="w-[200px] h-[200px] rounded-full border-2 border-gray-300 object-cover"
    />
    <ProfileCard heading={"Bio"} text={user?.bio} />
    <ProfileCard heading={"username"} text={user?.username} Icon={<MdAlternateEmail/>}/>
    <ProfileCard heading={"name"} text={user?.name} Icon={<FaFaceGrinWink/>}/>
    <ProfileCard heading={"joined"} text={moment(user?.createdAt).fromNow()} Icon={<SlCalender/>}/>
  </div>
  )
}

const ProfileCard = ({text,Icon,heading}) => <div className=' space-y-[0.5rem] items-center text-center flex'>
 <div className='text-white p-3'> {
    Icon && Icon
  }</div>
  <div >
   <span className='text-white'> {text}</span><br/>
   <span className='text-gray-400'>{heading}</span>
  </div>
</div>
  
     




export default Profile

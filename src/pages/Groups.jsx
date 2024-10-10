import React, { useState,memo, useEffect, lazy, Suspense } from 'react'
import { MdKeyboardBackspace,MdOutlineMenu,MdOutlineDone,MdDeleteOutline } from "react-icons/md";
import {Link, useNavigate,useSearchParams} from 'react-router-dom'
import AvatarCard from '../components/shared/AvatarCard'
import { sampleChats, sampleusers } from '../components/constants/sampleData';
import { FaPencilAlt } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import UserItem from '../components/shared/UserItem';
import { useAddGroupMemberMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hooks';
import { LayoutLoader } from '../components/layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';

const ConfirmDeleteDialog=lazy(()=>import("../components/dailogs/ConfirmDeleteDialog"))
const AddMemberDailog=lazy(()=>import("../components/dailogs/AddMemberDailog"))



const Groups = () => {
  const chatId=useSearchParams()[0].get("group")
  const [groupName,setGroupName]= useState("")
   const [groupNameUpdatedValue,setGroupNameUpdatedValue]= useState("")
   const [renameGroup,isLoadingGroupName]=useAsyncMutation(useRenameGroupMutation)
   const [removeMember,isLoadingRemoveMember]=useAsyncMutation(useRemoveGroupMemberMutation)
   const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );
   

  const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(false)
  const [cnfDeleteDailog,setCnfDeleteDailog]=useState(false)
  const [isEdit,setIsEdit]=useState(false)
  const [members,setMembers]=useState([])
  const dispatch=useDispatch()
  const {isAddMember}= useSelector((state)=>state.misc)




  const myGroups=useMyGroupsQuery()
  const groupDetails=useChatDetailsQuery({chatId,populate:true},{skip:!chatId})
  console.log(myGroups.data)
  const errors=[{
    isError:myGroups.isError,
    error:myGroups.error
  },
{
  isError:groupDetails.isError,
  error:groupDetails.error
}
]

  useErrors(errors)
  useEffect(()=>{
    if(groupDetails.data)
    {
      setGroupName(groupDetails.data.chat.name)
      setGroupNameUpdatedValue(groupDetails.data.chat.name)
      setMembers(groupDetails.data.chat.members)

    }
    return ()=>{
      setGroupName("")
      setGroupNameUpdatedValue("")
      setMembers([])
      setIsEdit(false)
    }
  },[groupDetails.data])

  const navigate=useNavigate()

  
  const navBack=()=>{
      navigate("/")
  }

  const handleMobile=()=>{
    setIsMobileMenuOpen(prev=>!prev)
}

const handleMobileClose=()=>{
  setIsMobileMenuOpen(false)
}

const updateGroupName=()=>{
    setIsEdit(false)
    renameGroup("Updating group name...",{chatId,name:groupNameUpdatedValue})
}

const cnfDeleteHandler=()=>{
  setCnfDeleteDailog(true)
}

const closeCnfDeleteHandler=()=>{
  setCnfDeleteDailog(false)
}

const deleteHandler=()=>{
  
  deleteGroup("Deleting Group...", chatId);
  closeCnfDeleteHandler()
  navigate("/groups")
}


const openAddMember=()=>{
    dispatch(setIsAddMember(true))
}
const removeMemberHandler=(userId)=>{
     removeMember("Removing members...",{chatId,userId})
}
 useEffect(()=>{
  if(chatId){
 setGroupName(`Group Name ${chatId}`)
 setGroupNameUpdatedValue(`Group Name ${chatId}`)
  }
 return()=>{
   setGroupName("")
    setGroupNameUpdatedValue("")
    setIsEdit(false)
 }
 },[chatId])
const GroupName = (
  <div className="flex p-2 items-start">
    {isEdit ? (
      <div className='flex items-center space-x-2'>
    
      <input value={groupNameUpdatedValue} onChange={(e)=>setGroupNameUpdatedValue(e.target.value)} type="text" className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder='dfgdfgdfs'/>
     <button onClick={updateGroupName} disabled={isLoadingGroupName}><MdOutlineDone/></button>
      </div>
    ) : (
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold">{groupName}</h1>
        <button   disabled={isLoadingGroupName} onClick={()=>{setIsEdit(true)}} className="text-blue-500">
          <FaPencilAlt />
        </button>
      </div>
    )}
  </div>
);


  const IconBtns =<>
 
  <div className='container'> 
  <button className='fixed top-4 right-8 bg-black hover:bg-gray-800 text-white text-2xl rounded-2xl flex sm:hidden ' onClick={handleMobile}>
<MdOutlineMenu/>
  </button>
   <button className='absolute top-8 bg-black text-white text-2xl rounded-2xl hover:bg-gray-800' onClick={navBack}>
<MdKeyboardBackspace/>
   </button>

   
  
  </div>

 


  </>
  const buttonGroup=<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-4">
 
 <button 
  className="flex items-center text-xl rounded-lg bg-green-500 text-white p-2" 
  onClick={openAddMember}
>
  <IoIosPersonAdd className="mr-2" /> 
  Add Member
</button>

   <button className=" flex items-center text-xl rounded-lg bg-red-500 text-white" onClick={cnfDeleteHandler}>
   <MdDeleteOutline className="mr-2" /> Delete Group
  </button>
</div>

  return myGroups.isLoading?<LayoutLoader/> :(
    <div className="container flex   flex-row items-center  p-4 h-screen ">
    <div className="bg-blue-300   h-full w-[30%] p-4 hidden sm:flex">
    <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId}/>
    </div>

    <div className="  flex flex-col items-center justify-start   h-full w-full p-4 ">
        {IconBtns}
        {
         groupName && <>
         {GroupName}
         <h1 className='m-8 self-start '>Members</h1>
         <div className="w-full bg-slate-300 h-[50vh] overflow-auto p-4 flex items-center justify-center">
  <div className="flex flex-col space-y-4 w-[50%]">
    {members.map((i) => (
      <UserItem 
        user={i} 
        isAdded 
        handler={removeMemberHandler} 
        key={i._id} 
      />
    ))}
  </div>
</div>


         {buttonGroup}
         
         </>
        }
    </div>
    {
      isAddMember && <Suspense fallback={<div className='fixed inset-0 bg-black bg-opacity-50 z-40'></div>}><AddMemberDailog chatId={chatId}/></Suspense>
    }
    {
      cnfDeleteDailog && <Suspense fallback={<div className='fixed inset-0 bg-black bg-opacity-50 z-40'></div>}><ConfirmDeleteDialog isOpen={cnfDeleteDailog} isClose={closeCnfDeleteHandler} deleteHandler={deleteHandler}/></Suspense>
    }
    <div>
    {isMobileMenuOpen && (
        <div
            className="fixed inset-0 bg-black opacity-50 sm:hidden"
            onClick={handleMobileClose}
        />
    )}
    <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 sm:hidden`} 
    >
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">
                <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
            </h2>
        </div>
    </div>
</div>



</div>


  )
}




const GroupsList=({myGroups=[],chatId})=>{
  return (

   
  <div className='container '>
  {
  myGroups.length>0?(myGroups.map((group)=><GroupListItem group={group} chatId={chatId} key={group._id}/>)):(<h1 className='text-center p-4'>No Groups</h1>)
  }
  </div>
  )
}

const GroupListItem=memo(({group,chatId})=>{
   const {name,_id,avatar }=group
   return( <Link to={`?group=${_id}`} onClick={(e)=>{if(chatId===_id) e.preventDefault()}}>
    <div className=' flex flex-row space-x-4 items-center hover:bg-gray-400'>
      <AvatarCard avatar={avatar}/>
      <h1>{name}</h1>
    </div>
    </Link>
   )
})
export default Groups

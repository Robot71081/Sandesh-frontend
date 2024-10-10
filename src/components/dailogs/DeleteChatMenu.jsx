import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDeleteMenu } from '../../redux/reducers/misc';
import { useNavigate } from 'react-router-dom';
import { useAsyncMutation } from '../../hooks/hooks';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api';


const DeleteChatFileMenu = ({ anchorEl,  }) => {
  
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const {selectedDeleteChat}= useSelector((state)=>state.misc)

  const [deleteChat,_,deleteChatData]=useAsyncMutation(useDeleteChatMutation)
  const [leaveGroup,__,leaveGroupData]=useAsyncMutation(useLeaveGroupMutation)
  

  const closeFileMenu = () => {
    dispatch(setIsDeleteMenu(false));
  };

  const leaveGroups=()=>{
    closeFileMenu()
    leaveGroup("Leaving group ...",selectedDeleteChat.chatId)
  }

  const deleteChats=()=>{
    closeFileMenu()
    deleteChat("Deleting chat ...",selectedDeleteChat.chatId)
     
  }

  useEffect(()=>{
   if(deleteChatData || leaveGroupData)
   {
    navigate("/chats")
   }
  },[deleteChatData,leaveGroupData])

  

  

  const style = {
    position: 'absolute',
   
    zIndex: 10,
    width: '12rem',
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={style} anchorEl={anchorEl}>
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <button
          onClick={closeFileMenu}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close menu"
        >
          &times;
        </button>
        <div className="flex flex-col p-4" onClick={selectedDeleteChat.groupChat?leaveGroups:deleteChats}>
            {selectedDeleteChat.groupChat?(<>Leave Group</>):(<>Delete chat</>)}
        </div>
      </div>
    </div>
  );
};

export default DeleteChatFileMenu;


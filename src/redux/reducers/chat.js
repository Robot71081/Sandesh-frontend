import { createSlice } from "@reduxjs/toolkit"
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../components/constants/event";
const initialState={
  notificationCount:0,
  newMsgAlert:getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,get:true})|| [{
     chatId:"",
     count:0
  }]
}
const chatSlice=createSlice({
    name:"chat",
    initialState,
    reducers:{
      
      incrementNotification: (state) => {
        state.notificationCount += 1;

      },
      resetNotificationCount: (state) => {
        state.notificationCount = 0;
      },

      setNewMsgAlert:(state,action)=>{
          const index=state.newMsgAlert.findIndex((item)=>item.chatId===action.payload.chatId)
          if(index!== -1){
            state.newMsgAlert[index].count+=1
          }else{
            state.newMsgAlert.push({
              chatId: action.payload.chatId,
              count: 1
            });
          }
      },
      removeNewMsgAlert:(state,action)=>{
       state.newMsgAlert=state.newMsgAlert.filter((item)=>item.chatId!==action.payload)
        }
    

    }

})


export default chatSlice
export const {incrementNotification,resetNotificationCount,setNewMsgAlert,removeNewMsgAlert}=chatSlice.actions
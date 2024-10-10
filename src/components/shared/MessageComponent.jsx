import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../../lib/features';
import RenderAttachment from './RenderAttachment';

const MessageComponent = ({message,user}) => {
    const {sender,content,attachments=[],createdAt}=message;
    const sameSender=sender?._id===user?._id;

    const timeAgo=moment(createdAt).fromNow()
  return (
   
    <div 
    style={{
        alignSelf:sameSender?"flex-end":"flex-start",
        backgroundColor:"white",
        color:"black",
        borderRadius:"5px",
        padding:"0.5rem",
        width:"fit-content"
    }}>
     {
  !sameSender && (
    <div className='text-xs font-medium leading-normal text-[#2694ab]  mb-2'>
      {sender.name}
    </div>
  )
}
{
  content && (
    <div className='text-xl font-medium leading-normal text-black'>
      {content}
    </div>
  )
}

{
    attachments.length > 0 && attachments.map((attachment,index)=>{

  const url=attachment.url
  const file=fileFormat(url)
  return <div className='p-4 bg-white shadow-md rounded-md' key={index}>
   <a href={url} target='_blank' download className='text-black'>{RenderAttachment(file,url)}</a>
  </div>

    })
}
<div className='text-xs font-medium leading-normal text-gray-800'>
      {timeAgo}
    </div>


    </div>
  )
}

export default memo(MessageComponent)

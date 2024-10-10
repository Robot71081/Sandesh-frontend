import React from 'react'
import { transformImage } from '../../lib/features';
import { MdFileOpen } from "react-icons/md";

const RenderAttachment = (file,url) => {
   
   switch (file) {
    case "video":
        return (
        <Video src={url} preload="none" width={"200px"} controls />
        );
    case "image":
        return (
           
        <img src={url} alt="Attachment" width={"200px"} height={"150px"} style={{objectFit:"contain"}}/>
       

        );

    case "audio":
        return (
        <audio src={url} preload="none" controls />
        ); 
    default:
       return <MdFileOpen/>;
   }
}

export default RenderAttachment

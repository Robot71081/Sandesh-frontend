import React from 'react'

export const LayoutLoader = () => {
  return (
    <div className="h-screen  flex  container mx-auto ">
  <div className="flex flex-col flex-grow  sm:flex-row ">
    <div className=" hidden sm:block w-full sm:w-1/2 lg:w-1/2 h-screen">
    <div className="h-screen w-full flex-grow  bg-gray-400 animate-pulse rounded-md  text-white"></div>
    </div>
    <div className=" w-full flex-grow sm:w-1/2 lg:w-1/2 h-screen">
    <div className="h-screen w-full bg-gray-400 animate-pulse rounded-md  text-white"></div>
    </div>
    <div className="    hidden  flex-grow sm:block w-full sm:w-1/2 lg:w-1/2 h-screen">
    <div className="h-screen w-full flex-grow bg-gray-400 animate-pulse rounded-md text-white"></div>
    </div>
  </div>
</div>
  )
}

export const TypingLoader =()=>{
  return "Typing..."
}



import React from 'react'

const AvatarCard = ({avatar=[],max=4}) => {
  return (
    <div className='flex  gap-x-0.5'>
      <div className='container mx-auto p-4 bg-grey-100 rounded-lg'>
        {
          avatar.map((i,index)=>(
            <img 
            key={Math.random()*100}
            src={i}
            alt={`Avatar ${index}`}
           className='  w-12 h-12 rounded-full object-cover border-2 border-gray-300'
            />
          ))
        }
      </div>
    </div>
  )
}

export default AvatarCard

import React from 'react'
import AppLayout from '../components/layout/AppLayout'

const home = () => {
  return (
   <>
  <div className='bg-gray-200 h-screen'>
<h1 className=" text-center text-2xl p-[1rem] font-semibold mb-3">Select a friend to chat</h1>

</div>
   </>
  )
}

export default AppLayout()(home)

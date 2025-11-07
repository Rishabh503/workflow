import React from 'react'
import StudyTracker from './__components/StudyTracker' 
import SessionHistory from './__components/SessionHistory'

const Page = () => {
  return (
    <div className='min-h-screen  text-white p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-5xl font-bold mb-2'>Study Tracker</h1>
          {/* <p className='text-gray-400'>Select a subject and goal to begin your focus session.</p> */}
        </div>

        
        <StudyTracker />


        <SessionHistory />
      </div>
    </div>
  )
}

export default Page
import { Button } from '@/components/ui/button'
import React from 'react'
import { DialogDemo } from './__components/DialogBasedForm'
import Display from './__components/Display'

const SubjectPage = () => {
  return (
    <section className='px-8 py-6 min-h-screen'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-white'>
          Your Subjects
        </h1>
        <DialogDemo />
      </div>
      
      <Display />
    </section>
  )
}

export default SubjectPage
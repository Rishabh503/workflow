import HomePage from '@/components/custom/HomePage'
import { connectDB } from '@/lib/db'
import React from 'react'

const App = () => {
  connectDB()
  return (
    <div>
    <HomePage/>
    </div>
  )
}

export default App
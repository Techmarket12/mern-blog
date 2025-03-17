import React from 'react'
import CallToAction from '../components/CollToAction'
const Projects = () => {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6'>
      <h1 className='text-3xl font-semibold'>Projects</h1>
    <p className='text-md text-gray-500 p-3'>
      Hamza's Blog is a simple blog application where users can read and write blogs. It is built using the MERN stack.
    </p>
    <CallToAction/>
    </div>
  )
}

export default Projects
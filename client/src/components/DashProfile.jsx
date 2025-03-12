import { Button, TextInput } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'

const DashProfile = () => {
    const {currentUser} = useSelector(state => state.user)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-2'>
            <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full ">
            <img src={currentUser.profilePicture} alt="user" className='rounded-full w-full border-8 h-full object-cover border-[lightgray]' />

            </div>
        <TextInput className='mt-5' type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='password'/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
            Update
        </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5 cursor-pointer">
            <span>Delete account</span>
            <span>Sign Out</span>
        </div>
    </div>
  )
}

export default DashProfile
import { Button, TextInput } from 'flowbite-react'
import { set } from 'mongoose'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import getStorage from 'firebase/app'
import app from '../firebase.js'

const DashProfile = () => {
    const {currentUser} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const filePickerRef = useRef()

    console.log(filePickerRef);
    

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file))

    }
    useEffect(() => {

        if(imageFile) {
            uploadImage()
        }
     }, [imageFile])

    const uploadImage = async() => {
        console.log('uploading image');
        
    }
    const storage = getStorage(app);
    const fileName = new Date.getTime() + imageFile.name;

    
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4'>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
            <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full " onClick={() => filePickerRef.current.click()}>
            <img src={  imageFileUrl ||currentUser.profilePicture} alt="user" className='rounded-full w-full border-8 h-full object-cover border-[lightgray]' />

            </div>
        <TextInput className='mt-5' type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='password'/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
            Update
        </Button>
        </form>
        <div className="text-red-500  flex justify-between mt-5 cursor-pointer">
            <span>Delete account</span>
            <span>Sign Out</span>
        </div>
    </div>
  )
}

export default DashProfile
import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowCircleRight, HiDocumentText } from 'react-icons/hi'
import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../app/user/userSlice'
import { useDispatch } from 'react-redux'
import {useSelector} from 'react-redux'
const DashSidebar = () => {
      const location = useLocation()
      const [tab, setTab] = useState('')
      const dispatch = useDispatch()
        const currentUser = useSelector(state => state.user.currentUser)
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)

        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl) {
    
          setTab(tabFromUrl)
          
        }
    })

            const handleSignout = async () => {
                try {
                    const res = await fetch('/api/user/signout', {
                        method: 'POST',
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        console.log(data.message);
                        window.location.href = '/login';
                    }else {
                        dispatch(signoutSuccess());
                    }
                } catch (error) {
                    console.log(error.message);
                    
                }
            }
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>


              
                <Link to='/dashboard?tab=profile'>
                
                <Sidebar.Item as='div' active={tab === 'profile'} icon={HiUser} to='/dashboard?tab=profile' labelColor='dark' label={"User"}>Profile
                </Sidebar.Item>
                </Link>
                {
                    currentUser.isAdmin && (

                <Link to={`/dashboard?tab=posts`}>
                <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as="div">Posts 

                </Sidebar.Item>
                </Link>
                    )
                }
                <Sidebar.Item icon={HiArrowCircleRight} to='/dashboard?tab=profile' labelColor='dark'  label={"User"} onClick={handleSignout}>Signout
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
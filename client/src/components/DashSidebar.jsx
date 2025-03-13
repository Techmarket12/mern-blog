import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowCircleRight } from 'react-icons/hi'
import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const DashSidebar = () => {
      const location = useLocation()
      const [tab, setTab] = useState('')
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)

        const tabFromUrl = urlParams.get('tab')
        console.log(tabFromUrl);
        if(tabFromUrl) {
    
          setTab(tabFromUrl)
          
        }
    })
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>


              
                <Link to='/dashboard?tab=profile'>
                
                <Sidebar.Item as='div' active={tab === 'profile'} icon={HiUser} to='/dashboard?tab=profile' labelColor='dark' label={"User"}>Profile
                </Sidebar.Item>
                </Link>
                <Sidebar.Item icon={HiArrowCircleRight} to='/dashboard?tab=profile' labelColor='dark'  label={"User"}>Signout
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
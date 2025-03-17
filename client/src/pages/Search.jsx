import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'
export default function Search() {
    const [sidbarData, setSidebarData] = useState({
        searchTerm: '',
        sort:'desc',
        category: 'uncategorized',
    })
    const navigate = useNavigate()
    console.log(sidbarData);
    
    const [posts , setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const location = useLocation()
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const sortFromUrl = urlParams.get('sort')
        const categoryFromUrl = urlParams.get('category')

        if(searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidbarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl
            })
        }
        const fetchPosts = async () => { 
            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/post/getposts?${searchQuery}`)
            if(!res.ok) {
                setLoading(false)
                return
            }
            if(res.ok) {
                const data = await res.json()
                setPosts(data.posts)
                setLoading(false)
                if(data.posts.length === 9) {
                    setShowMore(true)

                }else {
                    setShowMore(false)
                }
            }
        }
        fetchPosts()
    },[location.search])

    const handleChange = (e) => { 
        e.preventDefault()

        if(e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidbarData,
                searchTerm: e.target.value
            })
        }
        if(e.target.id === 'sort') {
            const order = e.target.value || 'desc'
            setSidebarData({
                ...sidbarData,
                sort: order
            })
         }

        if(e.target.id === 'category') {
            const category = e.target.value || 'uncategorized'
            setSidebarData({
                ...sidbarData,
                category: category
            })


    }
}
        const handleSubmit = (e) => { 
            e.preventDefault()

            const urlParams = new URLSearchParams(location.search)
            urlParams.set('searchTerm', sidbarData.searchTerm)
            urlParams.set('sort', sidbarData.sort)
            urlParams.set('category', sidbarData.category)
            const searchQuery = urlParams.toString()
            navigate(`/search?${searchQuery}`)
        }

        const handleShowMore = async () => { 
            const numberOfPosts = posts.length
            const startIndex = numberOfPosts
            const urlParams = new URLSearchParams(location.search)
            urlParams.set('startIndex', startIndex)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/post/getposts?${searchQuery}`)

            if(!res.ok) {
                return
            }
            if(res.ok) {
                const data = await res.json()
                setPosts([...posts, ...data.posts])
                if(data.posts.length === 9) {
                    setShowMore(true)
                }else {
                    setShowMore(false)
                }
            }
        }
  return (
    <div className="flex flex-col md:flex-row">

        <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className="flex  gap-8">
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <TextInput 
                    placeholder='Search...' 
                    id='searchTerm'
                    type='text'
                    value={sidbarData.searchTerm}
                    onChange={handleChange}
                    />
                </div>
                <div  className='flex items-center gap-2'>
                    <label className="font-semibold">Sort:</label>
                    <Select onChange={handleChange} value={sidbarData.sort}  id='sort'>
                        <option value='desc'>Newest</option>
                        <option value='asc'>Oldest</option>
                    </Select>
                </div>
                <div  className='flex items-center gap-2'>
                    <label className="font-semibold">Category:</label>
                    <Select onChange={handleChange} value={sidbarData.category}  id='category'>
                        <option value='uncategorized'>Uncategorized</option>
                        <option value='NextJS'>NextJS</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>ReactJS</option>
                    </Select>
                </div>
                <Button type='submit' outline gradientDuoTone='purpleToPink'>Apply </Button>

            </form>
        </div>
        <div className="w-full">
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Post results</h1>
            <div className="">
                {
                   ! loading && posts.length === 0 && <p className='text-xl text-gray-500'>
                    No posts found
                   </p>
                }

                {
                    loading && (
                        <p className='text-xl text-gray-500'>
                            Loading...
                        </p>
                    )
                }
                {
                    !loading && posts && posts.map((post) => (
                        <PostCard key={post._id} post={post}/>
                    ))
                }
                {
                    showMore && (
                        <Button onClick={handleShowMore} className='w-full' outline gradientDuoTone='purpleToPink'>
                            Load more
                        </Button>
                    )
                }
            </div>
        </div>
    </div>
  )
}

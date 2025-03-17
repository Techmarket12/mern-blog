import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CollToAction from '../components/CollToAction'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'

export default function PostPage() {
    const { postSlug } = useParams()
    const [loadingPost, setLoadingPost] = useState(true)
    const [loadingRecentPosts, setLoadingRecentPosts] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const [recentPosts, setRecentPosts] = useState(null)

    // Fetch the post by slug
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoadingPost(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json()
                if (!res.ok) {
                    setError(true)
                    setLoadingPost(false)
                    return
                }
                if (res.ok) {
                    setPost(data.posts[0])
                    setError(false)
                    setLoadingPost(false)
                }
            } catch (error) {
                setError(true)
                setLoadingPost(false)
            }
        }
        fetchPost()
    }, [postSlug])

    // Fetch recent posts
    useEffect(() => {
        const fetchRecentPosts = async () => {
            setLoadingRecentPosts(true)
            try {
                const res = await fetch('/api/post/getposts?limit=3')
                const data = await res.json()
                if (!res.ok) {
                    setError(data.message)
                    return
                }
                setRecentPosts(data.posts)
                setLoadingRecentPosts(false)
            } catch (error) {
                setError('An error occurred while fetching posts.')
                setLoadingRecentPosts(false)
            }
        }
        fetchRecentPosts()  // Always call the effect
    }, [])

    if (loadingPost || loadingRecentPosts) return (
        <div className='flex justify-center items-center min-h-screen '>
            <Spinner size='xl' />
        </div>
    )

    return (
        <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'> {post && post.title} </h1>
            <Link className='self-center mt-5' to={`/search?category=${post && post.category}`}>
                <Button color='gray' pill size='xs'>
                    {post && post.category}
                </Button>
            </Link>

            <img src={post && post.image} className='mt-10 p-3 max-h-[600px] w-full object-cover' alt={post && post.title} />
            <div className="flex justify-between p-3 border-b border-slate-3000 mx-auto w-full max-2xl text-xs ">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post && post.content }} />
            <div className="max-w-4xl mx-auto w-full">
                <CollToAction />
            </div>
            <CommentSection postId={post._id} />
            <div className=" flex flex-col justify-center items-center mb-5">
                <h1 className='text-xl mt-5'>Recent articles</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {
                        recentPosts &&
                        recentPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                </div>
            </div>
        </main>
    )
}

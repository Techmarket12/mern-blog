import React from 'react'

const About = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div className="">
          <h1 className='text-3xl font-semibold text-center my-7'>About Hamza's Blog</h1>
          <div className="text-md text-gray-500 flrx flex-col gap-6">
            <p>
              Hamza's Blog is a simple blog application where users can read and write blogs. It is built using the MERN stack.
            </p>
            <p>
              The MERN stack consists of the following technologies:
            </p>
            <ul>
              <li>MongoDB: A document-based open source database.</li>
              <li>Express: A web application framework for Node.js.</li>
              <li>React: A JavaScript library for building user interfaces.</li>
              <li>Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.</li>
            </ul>
            <p>
              The application has the following features:
            </p>
            <ul>
              <li>Users can read blogs without signing in.</li>
              <li>Users can create an account and sign in.</li>
              <li>Users can create, read, update, and delete their own blogs.</li>
              <li>Users can like and comment on other users' blogs.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
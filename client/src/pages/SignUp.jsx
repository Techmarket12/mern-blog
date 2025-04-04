import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    if(!formData.username || !formData.email || !formData.password) {
      setErrorMessage('All fields are required')
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)

        
        
      })
      const data = await response.json()
      if(data.success == false) {
        setErrorMessage(data.message)
      }
      setLoading(false)
      if(response.ok) {
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }
  
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-col p-3 max-w-3xl mx-auto md:flex-row md:items-center  gap-5'>
        {/* // leftsite */}
        <div className="flex-1">

        <Link to="/" className='font-bold dark:text-white text-4xl '>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Hamza's</span>
            Blog
        </Link>
        <p className='text-sm mt-5'>This is a demo project. You can sign up with your email and password   </p>
        {/* // rightside */}
        </div>


        <div className="flex-1">
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <Label value='Your username'/>
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
           </div>
            <div className="">
              <Label value='Your email'/>
              <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange}/>
           </div>
            <div className="">
              <Label value='Your password'/>
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
           </div>
           <Button gradientDuoTone='purpleToPink' type='submit' pill className='' disabled={loading}>
              {
                loading ? (
                  <>
                  
                  <Spinner size='sm'/>
                  <span>Loading...</span>
                  </>
                ) : 'sign up'
              }
           </Button>
           <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5"> 
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
               Sign in
            </Link>

          </div>
          {
            errorMessage && 
              (<Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>)
            
          }
        </div>
      </div>
    </div>
  )
}

export default SignUp
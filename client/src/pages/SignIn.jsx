import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import  {signInStart, signInSuccess, signInFallure} from '../app/user/userSlice.js'
import OAuth from '../components/OAuth.jsx'


const SignIn = () => {
  const [formData, setFormData] = useState({})
  const {loading, error:errorMessage} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFallure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFallure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFallure(error.message));
    }
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-col p-3 max-w-3xl mx-auto md:flex-row md:items-center  gap-5'>
        {/* // leftsite */}
        <div className="flex-1">

        <Link to="/" className='font-bold dark:text-white text-4xl '>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Hamza's</span>
            Blog
        </Link>
        <p className='text-sm mt-5'>This is a demo project. You can sign in with your email and password   </p>
        {/* // rightside */}
        </div>


        <div className="flex-1">
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="">
              <Label value='Your email'/>
              <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange}/>
           </div>
            <div className="">
              <Label value='Your password'/>
              <TextInput type='password' placeholder='***********' id='password'  onChange={handleChange}/>
           </div>
           <Button gradientDuoTone='purpleToPink' type='submit' pill className='' disabled={loading}>
              {
                loading ? (
                  <>
                  
                  <Spinner size='sm'/>
                  <span>Loading...</span>
                  </>
                ) : 'sign in'
              }
           </Button>
           <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5"> 
            <span>Don't have an account ?</span>
            <Link to='/sign-up'  className='text-blue-500'>
               Sign up
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

export default SignIn
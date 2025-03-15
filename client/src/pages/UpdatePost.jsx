import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { use, useEffect, useState } from 'react';
import  app  from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate, useParams} from 'react-router-dom'
import { useSelector } from 'react-redux';
const UpdatePost = () => {
    const {postId} = useParams()
    const navigate = useNavigate()

    const {currentUser} = useSelector(state => state.user)
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    

    useEffect(() => {
        const fetchPost = async () => { 
            
            try {
                const res = await fetch(`/api/post/getPosts?postId=${postId}`)
                const data = await res.json()
                if(!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message)
                    return
                    
                }
                if(res.ok) {
                    setPublishError(null)
                    setFormData(data.posts[0])
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchPost ()
    }, [postId])
    

    const handleUploadImage = async () => { 

        try {
            if(!file) {
                setImageUploadError('Please select an image')
                return;
            }
            setImageUploadError(null)

            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);


            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progess.toFixed(0))


                },
                (error) => {
                    setImageUploadError('iamge upload failed')
                    setImageUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadError(null)
                        setImageUploadProgress(null)
                        setFormData({...formData, image: downloadURL})
                        console.log('File available at', downloadURL);
                    })
                }

            )
            
        } catch (error) {
            setImageUploadError('image upload failed')
            setImageUploadProgress(null)
            console.log(error);
            
        }
    }
    const handleSubmit = async (e) => { 
        e.preventDefault();
    
        try {
            // Vérifie si `formData._id` et `currentUser._id` sont bien définis et corrects
            console.log("Post ID:", formData._id);
            console.log("User ID:", currentUser._id);
    
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),  // Assure-toi que `formData` contient toutes les informations nécessaires
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                console.log('Error:', data.message);  // Affiche les erreurs renvoyées par le serveur
                setPublishError(data.message);
                return;
            }
    
            setPublishError(null);  // Réinitialise les erreurs
            navigate(`post/${data.slug}`);  // Redirige l'utilisateur vers le post mis à jour
        } catch (error) {
            console.log('Error during post update:', error);  // Affiche l'erreur dans la console pour mieux la diagnostiquer
            setPublishError('Post updating failed');
        }
    };
    

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>

        <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type='text' placeholder='Title ' id='title'  required className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title} />
                <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                    <option value='uncategorized'>Select a categorie</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nectjs'>Next.js</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type='file' accept='image/*' id='image' onChange={(e) => setFile(e.target.files[0])}/>
                <Button onClick={handleUploadImage} size='sm' outline type='button' gradientDuoTone= 'purpleToBlue'>
                    {
                        imageUploadProgress ? <div className='w-16 h-16' >
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                        </div> : 'Upload Image'
                    }
                </Button>
            </div>
                    {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                    {
                        formData.image && (
                            <img  src={formData.image} alt="upload" className='w-full h-72 object-cover' />
                        )
                    }
            <ReactQuill value={formData.content} onChange={(value) => setFormData({...formData, content:value })} theme='snow' placeholder='Write something...' className='h-72 mb-12' required/>
            <Button   type='Submit' gradientDuoTone='purpleToPink' >
                Update post
            </Button>
            {
                publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>
            }
        </form>

    </div>
  )
}

export default UpdatePost
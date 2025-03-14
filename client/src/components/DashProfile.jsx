import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import app from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess, deleteFailure, deleteStart, deleteSuccess, signoutSuccess } from '../app/user/userSlice.js';
import { useDispatch } from 'react-redux';
const DashProfile = () => {
    const { currentUser, error } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const [isUploading, setIsUploading] = useState(false);  // Suivi de l'état de l'upload

    const [formData, setFormData] = useState({})

    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log("File size:", file.size); // Log la taille du fichier
        
        // Réinitialise l'erreur à chaque nouveau fichier sélectionné
        setImageFileUploadError(null);

        if (file.size < 2 * 1024 * 1024) { // Vérifie si la taille est inférieure à 2MB
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));  // Affiche un aperçu local de l'image
        } else {
            setImageFileUploadError('File must be smaller than 2MB');
        }
    };

    useEffect(() => {
        if (imageFile) {
            console.log("Uploading file:", imageFile.name);  // Log le fichier en cours d'upload
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        if (!imageFile) return;  // Assure-toi que imageFile existe avant d'essayer de l'uploader
        setImageFileUploading(true);  // Déclenche l'état d'upload
        setIsUploading(true); // Déclenche l'état d'upload
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        // Écoute des changements de l'état du téléchargement
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                console.error("Upload error:", error.code);  // Log l'erreur Firebase pour plus de détails
                setImageFileUploadError('Could not upload image');
                setIsUploading(false);
                setImageFileUploadProgress(null) 
                setImageFileUploading(false)  // Réinitialiser l'état de l'upload en cas d'erreur
            },
            () => {
                // Une fois l'upload terminé, récupérer l'URL de l'image téléchargée
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePicture: downloadURL})
                    setIsUploading(false);  // Terminer l'upload
                    setImageFileUploading(false);  // Terminer l'upload
                });
            }
        );
    };

    const handleChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.id]: e.target.value });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null)
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes detected");
            return;
        }
        if(imageFileUploading) {
            setUpdateUserError("Please wait for image to upload");
            return
        }
        try {
            dispatch(updateStart());
    
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Permet l'envoi des cookies avec la requête
                body: JSON.stringify(formData),
            });
    
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("user uploaded successfully")
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };
    const handleDeleteUser = async () => {
        setShowModal(false);
        console.log("Deleting user with ID:", currentUser._id);  // Log de l'ID de l'utilisateur
    
        try {
            dispatch(deleteStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE', // Envoi des cookies
            });
    
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteFailure(data.message));
            } else {
                dispatch(deleteSuccess());

            }
        } catch (error) {
            dispatch(deleteFailure(error.message));
        }
    };

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
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div
                    className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative"
                    onClick={() => filePickerRef.current.click()}
                >
                    {/* Afficher la barre de progression seulement pendant l'upload */}
                    {isUploading && imageFileUploadProgress > 0 && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
                            <CircularProgressbar
                                value={imageFileUploadProgress}
                                text={`${imageFileUploadProgress}%`}
                                strokeWidth={5}
                                styles={{
                                    path: {
                                        stroke: 'purple',
                                        strokeLinecap: 'round',
                                    },
                                    text: {
                                        fill: 'purple',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        </div>
                    )}

                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className='rounded-full w-full border-8 h-full object-cover border-[lightgray]'
                    />
                </div>

                {/* Affichage des erreurs d'upload */}
                {imageFileUploadError && <Alert color='failure'> {imageFileUploadError} </Alert>}

                <TextInput
                    className='mt-5'
                    type='text'
                    id='username'
                    placeholder='username'
                    defaultValue={currentUser.username} onChange={handleChange}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5 cursor-pointer">
                <span onClick={() => setShowModal(true)}>Delete account</span>
                <span onClick={handleSignout}>Sign Out</span>
            </div>
            {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false) } popup size="md">
        <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-lg text-gray-500'>Are you sure you want to delete your account ? </h3>
                    <div className=" flex justify-center gap-4">
                        <Button color='failure' onClick={handleDeleteUser}>
                            Yes, I'm sure
                        </Button>
                        <Button onClick={() => setShowModal(false)} color='gray'>
                            Cancel

                        </Button>
                    </div>
                </div>
            </Modal.Body>
      </Modal>
        </div>
    );
};

export default DashProfile;

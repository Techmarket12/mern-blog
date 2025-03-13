import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import app from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);  // Suivi de l'état de l'upload

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
                setImageFileUploadProgress(null) // Réinitialiser l'état de l'upload en cas d'erreur
            },
            () => {
                // Une fois l'upload terminé, récupérer l'URL de l'image téléchargée
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setIsUploading(false);  // Terminer l'upload
                });
            }
        );
    };

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
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
                    defaultValue={currentUser.username}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='email'
                    defaultValue={currentUser.email}
                />
                <TextInput type='password' id='password' placeholder='password' />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5 cursor-pointer">
                <span>Delete account</span>
                <span>Sign Out</span>
            </div>
        </div>
    );
};

export default DashProfile;

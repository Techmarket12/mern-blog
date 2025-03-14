import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';

const CreatePost = () => {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>

        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form className='flex flex-col gap-4'>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type='text' placeholder='Title ' id='title'  required className='flex-1'/>
                <Select>
                    <option value='uncategorized'>Select a categorie</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nectjs'>Next.js</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type='file' accept='image/*' id='image' required/>
                <Button size='sm' outline type='button' gradientDuoTone= 'purpleToBlue'>
         Upload Image 
                </Button>
            </div>
            <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required/>
            <Button type='Submit' gradientDuoTone='purpleToPink' >
                Publish
            </Button>
        </form>

    </div>
  )
}

export default CreatePost
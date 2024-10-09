import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helper/UploadFile'
import axios from 'axios'
import toast from 'react-hot-toast'
import Divider from './Divider'
import { useDispatch } from 'react-redux'
import {setUser} from '../redux/userSlice'
import { MdOutlineEdit } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const EditUserDetails = ({onClose, user}) => {
const [data, setdata] = useState({

    name: user?.user || '',
    profile_pic : user?.profile_pic ||''
})

const uploadPhotoRef = useRef()

const dispatch = useDispatch()

useEffect(()=>{
    setdata((prev)=>{
        return{
            ...prev,
            ...user
        }
    })
},[user])

const handleOnChange = (e)=>{
        const {name, value} = e.target

        setdata((prev)=>{
            return{
                ...prev,
                [name] : value
            }
        })
}

const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);
    console.log("Uploaded Photo: ", uploadPhoto);  // Ensure the response is valid

    setdata((prev) => ({
        ...prev,
        profile_pic: uploadPhoto?.url || prev.profile_pic // Ensure there's a valid URL
    }));
};

const handleOpenUploadPhoto = (e)=>{
    e.preventDefault()
    e.stopPropagation()
    uploadPhotoRef.current.click()
}


const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
        // Remove circular references or unnecessary fields
        const filteredData = {
            name: data.name,
            profile_pic: data.profile_pic
        };

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
        const response = await axios({
            method: 'post',
            url: URL,
            data: filteredData, // Send only serializable fields
            withCredentials: true
        });

        // Log the full response to inspect the structure
        console.log("Response: ", response);

        // Ensure response.data exists before accessing it
        if (response && response.data) {
            toast.success(response.data.message);

            if (response.data.success) {
                dispatch(setUser(response.data.data));
                onClose();
            }
        } else {
            toast.error("Unexpected response structure");
        }

    } catch (error) {
        console.error("Error in Axios request: ", error);
        // Handle error response from axios (if available)
        if (error.response && error.response.data) {
            toast.error(error.response.data.message || "An error occurred");
            console.log("Error response data: ", error.response.data);
        } else {
            toast.error("An unknown error occurred");
        }
    }
};

  return (
        <div className='fixed top-0 bottom-0 left-0 right-0 backdrop-blur-sm flex justify-center items-center z-10'>
            <div className='bg-neutral-900 text-white p-4 py-6 m-1 rounded w-full max-w-lg'>
            <h1 className='font-semibold text-lg'>Profile details</h1>
            <Divider />
            <p className='text-sm'>Edit user details</p>
        
            <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                <div className='flex gap-6'>
                {/* Left side with form fields */}
                <div className='flex flex-col gap-3 w-full'>
                    <div className='flex flex-col gap-1'>
                    <label htmlFor='name'>
                        <i>Name: </i>
                    </label>
                    <div className='flex items-center gap-2'>
                        <input
                        type='text'
                        name='name'
                        id='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='w-full py-1 px-2 bg-neutral-800 focus:outline-primary border border-gray-300 rounded-md'
                        />
                        <MdOutlineEdit className='cursor-pointer' />
                    </div>
                    </div>
        
                    {/* Change photo button */}
                    <div>
                    <div><i>Photo: </i></div>
                    <label htmlFor='profile_pic'>
                        <button
                        className='font-semibold flex items-center justify-center h-8 bg-slate-400 hover:bg-slate-100 active:bg-slate-400 focus:outline-none px-4 py-1 rounded-md shadow-sm transition-colors duration-200 ease-in-out mt-2 gap-2'
                        onClick={handleOpenUploadPhoto}>
                        Change Photo <FiEdit className='text-m' />
                        </button>
                        <input
                        type='file'
                        id='profile_pic'
                        className='hidden'
                        onChange={handleUploadPhoto}
                        ref={uploadPhotoRef}
                        />
                    </label>
                    </div>
                </div>
        
                {/* Right side with avatar */}
                <div className='flex items-center justify-center'>
                    <Avatar
                    imageUrl={data?.profile_pic}
                    name={data?.name}
                    width={150}
                    height={150}
                    />
                </div>
                </div>
        
                <Divider />
        
                {/* Save/Cancel Buttons */}
                <div className='flex gap-2 w-fit ml-auto'>
                <button
                    onClick={onClose}
                    className='border h-10 bg-gray-300 border-violet-500 text-primary px-5 py-2 rounded-lg transition-all duration-100 ease-in-out hover:bg-violet-800 hover:text-white shadow-md hover:shadow-lg'>
                    Cancel
                </button>
        
                <button
                    onClick={onsubmit}
                    className='border h-10 border-primary bg-violet-800 text-white px-5 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-secondary hover:text-white shadow-md hover:shadow-lg'>
                    Save
                </button>
                </div>
            </form>
            </div>
        </div>
        
  )
}

export default React.memo(EditUserDetails)

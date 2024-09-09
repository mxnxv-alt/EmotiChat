import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helper/UploadFile'
import axios from 'axios'
import toast from 'react-hot-toast'
import Divider from './Divider'
import { useDispatch } from 'react-redux'
import {setUser} from '../redux/userSlice'

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
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-10'>
     
        <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>Profile details</h2>
                <p className='text-sm'>Edit user details</p>

                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'> 
                        <label htmlFor='name'>Name: </label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleOnChange}
                            className='w-full, py-1, px-2 focus:outline-primary border-0.5'
                        />
                    </div>

                    <div>
                        <div>Photo:</div>
                            <div className='my-1 flex items-center  gap-4'>
                                <Avatar
                                imageUrl={data?.profile_pic}
                                name={data?.name}
                                width={40}
                                height={40}
                                />
                            <label htmlFor='profile_pic'>
                                <button className='font-semibold h-10 bg-slate-300 hover:active-bg-slate-200 focus:outline-none p-3 pt-2 ' onClick={handleOpenUploadPhoto}>Change Photo</button>
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

                    <Divider/>

                    <div className='flex gap-2 w-fit ml-auto '>
                        <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                        <button onClick={onsubmit} className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'>Save</button>
                    </div>
                </form>
        </div>
    
    </div>
  )
}

export default React.memo(EditUserDetails)

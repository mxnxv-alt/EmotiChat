import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlus, FaVideo } from "react-icons/fa6";
import { IoMdImages } from "react-icons/io";
import uploadFile from '../helper/UploadFile';
import { IoClose } from "react-icons/io5";


const MessagePage = () => {
    const params = useParams();
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const user = useSelector(state => state?.user)
    const [dataUser, setDataUser] = useState({
        name : "",
        _id : "",
        email : "",
        profile_pic : "",
        online: false
    })

    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
    const[message, setMessage] = useState({
        text : "",
        imageUrl : "",
        videoUrl: ""
    })

    const handleOpenImageVideoUpload = ()=>{
        setOpenImageVideoUpload(prev => !prev)
    }

    const handleUploadImage = async(e) =>{
        const file = e.target.files[0]
    
        const uploadPhoto = await uploadFile(file)
        
        setMessage(prev =>{
            return{
                ...prev,
                imageUrl : uploadPhoto.url
            }
        })
    }

    const handleUploadVideo = async(e)=>{
        const file = e.target.files[0]
    
        const uploadPhoto = await uploadFile(file)
        
        setMessage(prev =>{
            return{
                ...prev,
                videoUrl : uploadPhoto.url
            }
        })
    }
    const handleClearUploadImage = ()=>{
        setMessage(prev =>{
            return{
                ...prev,
                videoUrl : ""
            }
        })
    }

    useEffect(() => {
        if (socketConnection && params.userId) {
            socketConnection.emit('message-page', params.userId);

            socketConnection.on('message-user', (data) => {
                console.log('User details:', data);
                setDataUser(data)
            });

            socketConnection.on('error', (error) => {
                console.error('Socket error:', error.message);
            });
        }
    }, [socketConnection, params?.userId,user]);

    return ( 
        <div>
                <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
                    <div className='flex items-center gap-4'>
                        <Link to={"/"} className='lg:hidden'>
                            <IoIosArrowBack />
                        </Link>
                        <div>
                            <Avatar
                                width={50}
                                height={50}
                                imageUrl={dataUser?.profile_pic}
                                name= {dataUser?.name}
                                userId={dataUser?._id}
                            />
                        </div>
                        <div>
                            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                            <p className='-my-2 text-sm'>
                                {
                                    dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
                                }
                            </p>
                        </div>
                    </div>

                    <div>
                        <button className='cursor-pointer hover:text-primary'>
                            <BsThreeDotsVertical
                            size={20}
                             />
                        </button>
                    </div>

                </header>

                <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative'>
                        {
                            message.imageUrl && (
                                <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                                    <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary' onClick={handleClearUploadImage}>
                                        <IoClose size={30}/>
                                    </div>
                                    <div className='bg-white p-3'>
                                        <img
                                            src={message.imageUrl}
                                            width={300}
                                            height={300}
                                            alt='uploadImage'
                                        />
                                    </div>
                                </div>
                            )
                        }
                        
                    Show all messages
                </section>   

                <section className='h-16 bg-white flex items-center px-2'>
                    <div className='relative '>
                        <button onClick={handleOpenImageVideoUpload} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
                            <FaPlus size={20}/>
                        </button>

                        {
                            openImageVideoUpload && (
                                <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                                <form>
                                    <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-2 hover:bg-slate-200 cursor-pointer'>
                                        <div className='text-primary'>
                                            <IoMdImages size={18}/>
                                        </div>
                                        <p>Image</p>
                                    </label>
                                    <label htmlFor='uploadVideo'className='flex items-center p-2 px-3 gap-2 hover:bg-slate-200 cursor-pointer'>
                                        <div className='text-primary'>
                                            <FaVideo  size={18}/>
                                        </div>
                                        <p>Video</p>
                                    </label>
                                    
                                    <input 
                                        type='file'
                                        id='uploadImage'
                                        onChange={handleUploadImage}
                                    />
                                    <input 
                                        type='file'
                                        id='uploadVideo'
                                        onChange={handleUploadVideo}
                                    />

                                </form  >
                                </div>
                            )
                        }
                        
                    </div>
                </section>         
                
        </div>
    )
};

export default MessagePage;

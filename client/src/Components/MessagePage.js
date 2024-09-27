import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import Avatar from './Avatar';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlus, FaVideo, FaImage } from "react-icons/fa6";
import uploadFile from '../helper/UploadFile';
import { IoClose } from "react-icons/io5";
import { IoSend } from 'react-icons/io5';
import Loading from './Loading';
import backgroundImage from '../Assets/background.jpg';
import moment from 'moment';

const MessagePage = () => {
    const params = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const user = useSelector(state => state?.user);
    const [dataUser, setDataUser] = useState({
        name: "",
        _id: "",
        email: "",
        profile_pic: "",
        online: false
    });

    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
    const [message, setMessage] = useState({
        text: "",
        imageUrl: "",
        videoUrl: ""
    });

    const [loading, setLoading] = useState(false);

    const [allMessage, setAllMessage] = useState([]);

    const currentMessage = useRef(null);

    useEffect(() => {
        if (currentMessage.current) {
            currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [allMessage]);

    const handleOpenImageVideoUpload = () => {
        setOpenImageVideoUpload(prev => !prev);
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setLoading(true);
        try {
            const uploadPhoto = await uploadFile(file);
            setMessage(prev => ({
                ...prev,
                imageUrl: uploadPhoto.url
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            // Optionally display error to the user
        } finally {
            setLoading(false);
            setOpenImageVideoUpload(false);
        }
    };

    const handleClearUploadImage = () => {
        setMessage(prev => ({
            ...prev,
            imageUrl: ""
        }));
    };

    const handleUploadVideo = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setLoading(true);
        try {
            const uploadVideo = await uploadFile(file);
            setMessage(prev => ({
                ...prev,
                videoUrl: uploadVideo.url
            }));
        } catch (error) {
            console.error('Error uploading video:', error);
            // Optionally display error to the user
        } finally {
            setLoading(false);
            setOpenImageVideoUpload(false);
        }
    };

    const handleClearUploadVideo = () => {
        setMessage(prev => ({
            ...prev,
            videoUrl: ""
        }));
    };

    useEffect(() => {
        if (socketConnection && params.userId) {
            // Validate userId before emitting
            if (/^[0-9a-fA-F]{24}$/.test(params.userId)) {
                socketConnection.emit('message-page', params.userId);
            } else {
                console.error('Invalid userId in params:', params.userId);
                // Optionally navigate back or display error
                navigate('/'); // Redirect to home
            }

            const handleMessageUser = (data) => {
                console.log('User details:', data);
                setDataUser(data);
            };

            const handleMessage = (data) => {
                console.log('message data:', data);
                setAllMessage(data || []);
            };

            const handleError = (error) => {
                console.error('Socket error:', error.message);
                // Optionally display error to the user
            };


            socketConnection.emit('seen', params.userId)
            socketConnection.on('message-user', handleMessageUser);
            socketConnection.on('message', handleMessage);
            socketConnection.on('error', handleError);

            // Cleanup listeners on unmount or when userId changes
            return () => {
                socketConnection.off('message-user', handleMessageUser);
                socketConnection.off('message', handleMessage);
                socketConnection.off('error', handleError);
            };
        }
    }, [socketConnection, params.userId, user, navigate]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setMessage(prev => ({
            ...prev,
            [name]: value // Use dynamic key to handle multiple fields if needed
        }));
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (message.text || message.imageUrl || message.videoUrl) {
            if (socketConnection) {
                // Ensure sender and receiver are valid ObjectIds
                if (/^[0-9a-fA-F]{24}$/.test(user._id) && /^[0-9a-fA-F]{24}$/.test(params.userId)) {
                    socketConnection.emit('new message', {
                        sender: user._id,
                        receiver: params.userId,
                        text: message.text,
                        imageUrl: message.imageUrl,
                        videoUrl: message.videoUrl,
                        msgByUserId: user._id
                    });
                    setMessage({
                        text: "",
                        imageUrl: "",
                        videoUrl: ""
                    });
                } else {
                    console.error('Invalid sender or receiver ID:', user._id, params.userId);
                    // Optionally display error to the user
                }
            }
        }
    };

    return (
        <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover'>
            <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-5'>
                <div className='flex items-center gap-4'>
                    <Link to="/" className='lg:hidden'>
                        <IoIosArrowBack />
                    </Link>
                    <div>
                        <Avatar
                            width={50}
                            height={50}
                            imageUrl={dataUser?.profile_pic}
                            name={dataUser?.name}
                            userId={dataUser?._id}
                        />
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                        <p className='-my-2 text-sm'>
                            {dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>}
                        </p>
                    </div>
                </div>

                <div>
                    <button className='cursor-pointer hover:text-primary'>
                        <BsThreeDotsVertical size={20} />
                    </button>
                </div>
            </header>

            <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-20'>
                <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
                    {allMessage.map((msg) => (
                        <div
                            key={msg._id}
                            className={` p-1 py-2 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto bg-teal-200" : "bg-white"}`}
                        >
                            <div className='w-full'>
                                {msg?.imageUrl && (
                                    <img
                                        src={msg.imageUrl}
                                        className='w-full h-full object-scale-down'
                                        alt='Message Image'
                                    />
                                )}

                                {msg?.videoUrl && (
                                    <video
                                        src={msg.videoUrl}
                                        className='w-full h-full object-scale-down'
                                        controls
                                    />
                                )}
                            </div>
                            <p className='px-2'>{msg.text}</p>
                            <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm A')}</p>
                        </div>
                    ))}
                </div>

                {message.imageUrl && (
                    <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary' onClick={handleClearUploadImage}>
                            <IoClose size={40} />
                        </div>
                        <div className='bg-white p-3'>
                            <img
                                src={message.imageUrl}
                                alt='uploadImage'
                                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                            />
                        </div>
                    </div>
                )}

                {message.videoUrl && (
                    <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary' onClick={handleClearUploadVideo}>
                            <IoClose size={40} />
                        </div>
                        <div className='bg-white p-3'>
                            <video
                                src={message.videoUrl}
                                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                                controls
                                muted
                                autoPlay
                            />
                        </div>
                    </div>
                )}

                {loading && (
                    <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
                        <Loading />
                    </div>
                )}
            </section>

            <section className='h-16 bg-white flex items-center px-2'>
                <div className='relative '>
                    <button onClick={handleOpenImageVideoUpload} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
                        <FaPlus size={20} />
                    </button>

                    {openImageVideoUpload && (
                        <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                            <form>
                                <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-2 hover:bg-slate-200 cursor-pointer'>
                                    <div className='text-primary'>
                                        <FaImage size={18} />
                                    </div>
                                    <p>Image</p>
                                </label>
                                <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-2 hover:bg-slate-200 cursor-pointer'>
                                    <div className='text-primary'>
                                        <FaVideo size={18} />
                                    </div>
                                    <p>Video</p>
                                </label>

                                <input
                                    type='file'
                                    id='uploadImage'
                                    onChange={handleUploadImage}
                                    className='hidden'
                                    accept='image/*'
                                />
                                <input
                                    type='file'
                                    id='uploadVideo'
                                    onChange={handleUploadVideo}
                                    className='hidden'
                                    accept='video/*'
                                />
                            </form>
                        </div>
                    )}
                </div>

                <form className="h-full w-full flex gap-2 items-center" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        name="text" // Added name attribute for dynamic handling
                        placeholder="Enter Your Message..."
                        className="py-2 px-4 outline-none flex-grow h-full "
                        value={message.text}
                        onChange={handleOnChange}
                    />
                    <button
                        className="bg-primary text-white hover:bg-secondary w-12 h-12 rounded-full flex items-center justify-center transition duration-300 ease-in-out"
                        type="submit"
                    >
                        <IoSend size={20} />
                    </button>
                </form>
            </section>
        </div>
    );

};

export default MessagePage;

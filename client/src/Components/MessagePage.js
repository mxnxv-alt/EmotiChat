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
import SpeechButton from './SpeechButton'; // Import SpeechButton
import { BsEmojiLaughing } from "react-icons/bs";//<BsEmojiLaughing />

const MessagePage = () => {
    const params = useParams();
    const navigate = useNavigate(); 
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
                }
            }
        }
    };

    const handleTranscribe = (transcript) => {
        setMessage(prev => ({
            ...prev,
            text: prev.text + ' ' + transcript
        }));
    };

    return (
        <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover h-screen'>
            <header className='sticky top-0 h-16 bg-neutral-800 text-white flex justify-between items-center px-5'>
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
                        <p className='-my-2 text-sm py-1'>
                            {dataUser.online ? <span className='text-teal-500'>online</span> : <span className='text-slate-400'>offline</span>}
                        </p>
                    </div>
                </div>

                <div>
                    <button className='cursor-pointer hover:text-teal-500'>
                        <BsThreeDotsVertical size={20} />
                    </button>
                </div>
            </header>

            <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-20'>
                <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
                    {allMessage.map((msg) => (
                        <div
                            key={msg._id}
                            className={` p-1 py-2 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto bg-teal-200" : "text-white shadow-2xl bg-neutral-800"}`}
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
                            <p className='text-xs ml-auto w-fit text-neutral-400 px-1'>{moment(msg.createdAt).format('hh:mm A')}</p>
                        </div>
                    ))}
                </div>

                {message.imageUrl && (
                    <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer text-white hover:text-teal-500' onClick={handleClearUploadImage}>
                            <IoClose size={40} />
                        </div>
                        <div className='bg-neutral-800 p-3'>
                            <img
                                src={message.imageUrl}
                                alt='uploadImage'
                                className='w-full h-full max-w-sm m-2 object-scale-down'//aspect-square
                            />
                        </div>
                    </div>
                )}

                {message.videoUrl && (
                    <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer text-white hover:text-teal-500' onClick={handleClearUploadVideo}>
                            <IoClose size={40} />
                        </div>
                        <div className='bg-neutral-800 p-3'>
                            <video
                                src={message.videoUrl}
                                className='w-full h-full max-w-sm m-2 object-scale-down'//aspect-square
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

            <section className='h-16 bg-neutral-800 text-white flex items-center px-2'>
                {/* Flex container for message input controls */}
                <div className='flex items-center gap-2 w-full'>
                    {/* Send Image/Video Button */}
                    <div className='relative'>
                        <button
                            onClick={handleOpenImageVideoUpload}
                            className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-violet-500 hover:text-white transition-colors duration-200 ease-in-out'
                            title="Send Image or Video"  >
                            <FaPlus size={20} />
                        </button>

                        {openImageVideoUpload && (
                            <div className='bg-neutral-800 text-white shadow rounded absolute bottom-14 left-0 w-36 p-2 my-2'>
                                <form>
                                    <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-2 hover:bg-slate-700 cursor-pointer'>
                                        <div className='text-teal-300'>
                                            <FaImage size={18} />
                                        </div>
                                        <p>Image</p>
                                    </label>
                                    <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-2 hover:bg-slate-700 cursor-pointer'>
                                        <div className='text-teal-300'>
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

                    {/* SpeechButton Component */}
                    <SpeechButton
                        onTranscribe={handleTranscribe}
                        textToSpeak={message.text}
                    />

                    {/* Chat Text Input and Send Button */}
                    <form className="flex-grow flex gap-2 items-center" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            name="text" // Added name attribute for dynamic handling
                            placeholder="Enter Your Message..."
                            className="py-2 px-4 outline-none flex-grow h-full rounded-lg bg-neutral-800"
                            value={message.text}
                            onChange={handleOnChange}
                        />
                        <button
                            className="bg-violet-700 text-white hover:bg-secondary w-12 h-12 rounded-full flex items-center justify-center transition duration-300 ease-in-out"
                            type="submit"
                            title="Send Message"
                        >
                            <IoSend size={20} />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );

};

export default MessagePage;

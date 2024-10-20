import React, { useEffect, useState } from 'react';
import { BsChatTextFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom'; // Added useNavigate
import { ImExit } from "react-icons/im";
import Avatar from './Avatar';
import { useSelector, useDispatch } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { GoArrowUpLeft } from "react-icons/go";
import { FaVideo, FaImage } from "react-icons/fa6";
import SearchUser from './SearchUser';
import { setOnlineUser, logout } from '../redux/userSlice'; // Assuming you have this action

const Sidebar = () => {
    const user = useSelector(state => state?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const socketConnection = useSelector(state => state?.user?.socketConnection);

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user._id);

            socketConnection.on('conversation', (data) => {
                console.log('conversation', data);

                const conversationUserData = data.map((conversationUser) => {
                    if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.sender,
                        };
                    } else if (conversationUser?.receiver?._id !== user?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.receiver,
                        };
                    } else {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.sender,
                        };
                    }
                });
                setAllUser(conversationUserData);
            });

            // Handle potential errors from the server
            socketConnection.on('error', (error) => {
                console.error('Socket Error:', error.message);
                // Optionally display error to the user
            });

            // Handle onlineUser event
            socketConnection.on('onlineUser', (data) => {
                console.log('Online Users:', data);
                dispatch(setOnlineUser(data));
            });
        }

        // Cleanup listeners on unmount
        return () => {
            if (socketConnection) {
                socketConnection.off('conversation');
                socketConnection.off('error');
                socketConnection.off('onlineUser');
            }
        };
    }, [socketConnection, user, dispatch]);

    // Navigation handler
    const handleUserClick = (userId) => {
        // Validate that userId is a valid ObjectId before navigating
        if (/^[0-9a-fA-F]{24}$/.test(userId)) { // Simple regex check for ObjectId
            navigate(`/message/${userId}`);
        } else {
            console.error('Invalid userId:', userId);
            // Optionally display error to the user
        }
    };

    const handleLogout = () => {
        // Dispatch the logout action to update Redux store
        dispatch(logout());
    
        // Clear all data from local storage
        localStorage.clear();
    
        // Navigate the user to the login page
        navigate("/login");
    };
    
    return (
        <div className='w-full h-full flex bg-white'>
            {/* Sidebar Navigation */}
            <div className='bg-violet-500 w-12 h-full py-5 flex flex-col justify-between'>
                <div>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-violet-300 ${isActive && "bg-violet-300"}`
                        }
                        title='Chat'
                    >
                        <BsChatTextFill size={25} />
                    </NavLink>

                    <div
                        onClick={() => setOpenSearchUser(true)}
                        className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-violet-300'
                        title='Add Friend'
                    >
                        <FaUserPlus size={25} />
                    </div>
                </div>

                <div className='flex flex-col items-center'>
                    <button
                        className='mx-auto cursor-pointer p-1'
                        title={user?.name}
                        onClick={() => setEditUserOpen(true)}
                    >
                        <Avatar
                            width={40}
                            height={40}
                            name={user?.name}
                            imageUrl={user?.profile_pic}
                            userId={user?._id}
                        />
                    </button>
                    <button
                        onClick= {handleLogout}
                        className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-violet-300'
                        title='LogOut' >
                        <span>
                            <ImExit size={25} />
                        </span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className='w-full '>
                <div className='h-16 flex items-center bg-neutral-800 text-white'>
                    <h2 className='text-xl font-bold p-4'>Messages</h2>
                </div>
                <div className='bg-white p-[0.60px]'></div>

                <div className='h-[calc(100vh-65px)] bg-neutral-800 text-white overflow-x-hidden overflow-y-auto scrollbar'>
                    {allUser.length === 0 && (
                        <div className='mt-[80px]'>
                            <div className='flex justify-center items-center my-4 text-violet-500'>
                                <GoArrowUpLeft size={50} />
                            </div>
                            <p className='text-lg text-center text-violet-500'>
                                Explore users to start a conversation
                            </p>
                        </div>
                    )}

                    {allUser.map((conv) => {
                        const userId = conv.userDetails?._id;
                        const userName = conv.userDetails?.name;
                        const lastMessage = conv.lastMsg;

                        return (
                            <div
                                key={conv?._id}
                                className='flex items-center gap-2 cursor-pointer hover:bg-neutral-700 px-2 py-3 rounded'
                                onClick={() => handleUserClick(userId)}
                            >
                                <div>
                                    <Avatar
                                        imageUrl={conv?.userDetails?.profile_pic}
                                        name={userName}
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <div>
                                    <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{userName}</h3>
                                    <div className='text-slate-400 text-xs flex items-center gap-1'>
                                        <div className='flex items-center gap-1'>
                                            {
                                                conv?.lastMsg?.imageUrl && (
                                                <div className='flex items-center gap-1'>
                                                    <span><FaImage /></span>
                                                   {!lastMessage?.text && <span>Image</span>} 
                                                </div>
                                            )}

                                            {
                                                conv?.lastMsg?.videoUrl && (
                                                <div className='flex items-center gap-1'>
                                                    <span><FaVideo /></span>
                                                    {!lastMessage?.text && <span>Video</span>}
                                                </div>
                                            )}
                                        </div>
                                        <p className='text-ellipsis line-clamp-1'>{lastMessage?.text}</p>
                                    </div>

                                </div>
                                {
                                    Boolean(conv?.unseenMsg) && (
                                        <div className='w-1 h-10 ml-auto bg-violet-500 rounded-full'></div>
                                    )
                                    
                                }

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modals */}
            {editUserOpen && (
                <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
            )}

            {openSearchUser && (
                <SearchUser onClose={() => setOpenSearchUser(false)} />
            )}
        </div>
    );

};

export default Sidebar;

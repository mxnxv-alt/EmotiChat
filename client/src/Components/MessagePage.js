import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

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
        </div>
    )
};

export default MessagePage;

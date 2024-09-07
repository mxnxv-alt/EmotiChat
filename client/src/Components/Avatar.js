import React, { useEffect } from 'react';
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const Avatar = ({ userId, userName, imageUrl, width = 50, height = 50 }) => {

    const onlineUser = useSelector(state => state?.user?.onlineUser)
    const nameFromStore = useSelector(state => state.user.name);
    const name = userName || nameFromStore;

    let avatarName = "";
    if (name) {
        const splitName = name.split(" ");
        if (splitName.length > 1) {
            avatarName = splitName[0][0].toUpperCase() + splitName[1][0].toUpperCase();
        } else {
            avatarName = splitName[0][0].toUpperCase();
        }
    }

    const bgColor = [
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-blue-200',
        'bg-slate-200',
        'bg-zinc-400',
        'bg-orange-200',
        'bg-amber-200',
        'bg-lime-200',
        'bg-emerald-200',
        'bg-cyan-200',
    ];

    const randomnum = Math.floor(Math.random() * bgColor.length);

    const isOnline = onlineUser.includes(userId)

    return (
        <div className={`text-slate-800 object-cover font-bold relative`} style={{ width: width + "px", height: height + "px" }}>
            {
                imageUrl ? (
                    <img
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                        className='overflow-hidden object-cover'
                        
                    />
                ) : (
                    name ? (
                        <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full flex justify-center items-center ${bgColor[randomnum]}`}>
                            {avatarName}
                        </div>
                    ) : (
                        <FaRegCircleUser size={width} />
                    )
                )
            }

            {
                isOnline && (
                    <div className='bg-green-600 p-1 absolute bottom-2 -right-0 z-10 rounded-full'> </div>
                )
            }

        </div>
    );
}

export default Avatar;

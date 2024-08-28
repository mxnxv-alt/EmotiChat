import React from 'react';
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const Avatar = ({ userId, userName, imageUrl, width = 50, height = 50 }) => {
    const name = useSelector(state => state.user.name) || userName;

    let avatarName = "";
    if (name) {
        const splitName = name?.split(" ");

        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0];
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

    const randomnum = Math.floor(Math.random() * 11);

    return (
        <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full`}>
            {
                imageUrl ? (
                    <img
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={name}
                        className='overflow-hidden rounded-full'
                    />
                ) : (
                    name ? (
                        <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full flex justify-center items-center ${bgColor[randomnum]}`}>
                            {avatarName}
                        </div>
                    ) : (
                        <FaRegCircleUser
                            size={width}
                        />
                    )
                )
            }
        </div>
    );
}

export default Avatar;

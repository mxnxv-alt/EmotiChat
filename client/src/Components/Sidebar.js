import React, { useState } from 'react'
import { BsChatTextFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { ImExit } from "react-icons/im";
import Avatar from './Avatar'
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';

const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)
  return (
    <div className='w-full h-full'>
        <div className='bg-violet-500 w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between'>
           <div>
                <NavLink className={({isActive})=>`w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-violet-300 rounded ${isActive && "bg-violet-300"}`} title='Chat'>
                    <BsChatTextFill
                        size={25}                        
                    />
                </NavLink>

                <div className='w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-violet-300 rounded' title='Add Friend'>
                    <FaUserPlus
                        size={25}
                    />
                </div>
           </div>

            <div className='flex flex-col items-center'>
                <botton className='mx-auto cursor-pointer' title={user?.name} onClick = {()=>setEditUserOpen(true)} >
                    <Avatar
                        width={45}
                        height={45}
                    />
                </botton>
                <button className='w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-violet-300 rounded' title='LogOut'>
                    <ImExit
                        size={25}
                    />
                </button>
            </div>

        </div>

        {
            editUserOpen && (
                <EditUserDetails onClose = { ()=>setEditUserOpen(false)} user = {user} />
            )
        }

    </div>
  )
}

export default Sidebar

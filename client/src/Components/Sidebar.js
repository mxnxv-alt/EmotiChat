import React, { useState } from 'react'
import { BsChatTextFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { ImExit } from "react-icons/im";
import Avatar from './Avatar'
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from './SearchUser';

const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser,setAllUser] = useState([])
    const [openSearchUser,setOpenSearchUser] = useState(false)

  return (
    <div className='w-full h-full flex bg-white'>
        <div className='bg-violet-500 w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between'>
           <div>
                <NavLink className={({isActive})=>`w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-violet-300 rounded ${isActive && "bg-violet-300"}`} title='Chat'>
                    <BsChatTextFill
                        size={25}                        
                    />
                </NavLink>

                <div  onClick={()=>setOpenSearchUser(true)} className='w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-violet-300 rounded' title='Add Friend'>
                    <FaUserPlus
                        size={25}
                    />
                </div>
           </div>

            <div className='flex flex-col items-center'>
                <button className='mx-auto cursor-pointer' title={user?.name} onClick = {()=>setEditUserOpen(true)} >
                <Avatar
                    width={40}
                    height={40}
                    name={user?.name}
                    imageUrl={user?.profile_pic}
                    />
                </button>
                <button className='w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-violet-300 rounded' title='LogOut'>
                    <span className='-ml-2'>
                        <ImExit
                            size={25}
                        />
                    </span>
                </button>
            </div>

        </div>
        <div className='w-full '>
            <div className='h-16 flex items-center'>
                <h2 className='text-xl font-bold p-4'>Messages</h2>
            </div>
            <div className='bg-primary p-[0.60px]'></div>

            <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                {
                    allUser.length === 0 && (
                        <div className='mt-[80px]'>
                            <div className='flex justify-center items-center my-4 text-slate-800'>
                            <GoArrowUpLeft 
                                size={50}
                            />
                            </div>
                            <p className='text-lg text-center text-slate-600'>Explore users to start a conversation</p>
                        </div>
                    )
                }

            </div>

        </div>
        
        {
            editUserOpen && (
                <EditUserDetails onClose = { ()=>setEditUserOpen(false)} user = {user} />
            )
        }

        {
            openSearchUser && (
                <SearchUser onClose = { ()=>setOpenSearchUser(false) }/>
            )
        }

    </div>
    
  )
}

export default Sidebar

import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user , onClose }) => {

  return (
      <Link to={"/message/"+user?._id} onClick={onClose} className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:bg-neutral-800 rounded cursor-pointer '>
          <div>
              <Avatar
                  width={50}
                  height={50}
                  userName={user?.name} 
                  imageUrl={user?.profile_pic} 
                  userId={user?._id}
              />
          </div>
          <div>
              <div className='font-semibold text-ellipsis line-clamp-1'>
                  {user?.name}
              </div>
              <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
          </div>
      </Link>
  );
};


export default UserSearchCard;

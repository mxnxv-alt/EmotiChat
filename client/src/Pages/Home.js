import axios from 'axios'
import React , { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet,  useLocation, useNavigate } from 'react-router-dom'
import logo from '../Assets/logo.png'
import io from 'socket.io-client'
import { logout,  setOnlineUser,  setSocketConnection,  setUser } from '../redux/userSlice'
import Sidebar from '../Components/Sidebar'
import { RxHamburgerMenu } from "react-icons/rx";

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log('user',user)
  const fetchUserDetails = async()=>{
    try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
        const response = await axios({
          url : URL,
          withCredentials : true
        })

        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
            dispatch(logout())
            navigate("/login")
        }
        console.log("current user Details",response)
        } catch (error) {
            console.log("error",error)
        }
      }
      useEffect(()=>{
        fetchUserDetails()
      },[])
      
      const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

      const handleUserClick = (userId) => {
        navigate(`/message/${userId}`);
    };

      /***socket connection */
      const token = localStorage.getItem('token');
      useEffect(()=>{
        const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
            auth: {
            token: token,
            
          },
        })

        socketConnection.on('onlineUser',(data)=>{
          console.log(data)
          dispatch(setOnlineUser(data))
        })

        dispatch(setSocketConnection(socketConnection))

        return ()=>{
          socketConnection.disconnect()
        }
      },[])

      const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-neutral-600 ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
        <Sidebar />
      </section>

      <button 
        className="lg:hidden absolute top-1 left-1" 
        onClick={toggleSidebar}>
       <RxHamburgerMenu className='text-lg text-bold'/>
        
      </button>

      <section className={`${basePath && "hidden"}`} >
        <Outlet />
      </section>

      <div className={`justify-center login-page-background backdrop-blur-sm items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
        <div>
          <img src={logo} width={250} alt='logo' className="opacity-88" />
        </div>
        <p className='text-lg mt-2 text-white'>Select user to send message</p>
      </div>
    </div>
  );
};

export default Home

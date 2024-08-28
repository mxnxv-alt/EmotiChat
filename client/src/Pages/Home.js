import axios from 'axios'
import React , { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet,  useLocation, useNavigate } from 'react-router-dom'
import logo from '../Assets/logo.png'
// import io from 'socket.io-client'
import { logout,  setUser } from '../redux/userSlice'
import Sidebar from '../Components/Sidebar'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

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

  /***socket connection */
  // useEffect(()=>{
  //   const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
  //     auth : {
  //       token : localStorage.getItem('token')
  //     },
  //   })

  //   socketConnection.on('onlineUser',(data)=>{
  //     console.log(data)
  //     dispatch(setOnlineUser(data))
  //   })

  //   dispatch(setSocketConnection(socketConnection))

  //   return ()=>{
  //     socketConnection.disconnect()
  //   }
  // },[])
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className='bg-white'>
          <Sidebar/>
          </section>  


      <section>
        <Outlet/>
      </section>
    </div>
  )
}

export default Home

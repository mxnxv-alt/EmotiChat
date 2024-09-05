import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../Assets/logo.png';
import { useDispatch } from 'react-redux';
import { setToken, setName } from '../redux/userSlice';


const LoginRegister = () => {
    
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true); // Start loading

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/login`;

        try {
            const response = await axios({
        
                method:'post',
                    url : URL,
                    data:{
                        userId : location?.state?._id,
                        email: formData.email,
                        password: formData.password
                    },
                    withCredentials: true
                    
            })

            if (response.data.success) {
                toast.success("Login successful!");
                dispatch(setToken(response?.data?.data?.token))
                dispatch(setName(response?.data?.data?.name));
                localStorage.setItem('token', response?.data?.data?.token)
                setTimeout(() => { 
                    setLoading(false);
                    navigate('/home'); 
                }, 1000);
            } else if (response.data.error) {
                toast.error("1",response.data.message);
                setLoading(false);
            }

        } catch (error) {
            toast.error("2",error?.response?.data?.message || "An error occurred");
            setLoading(false); // Stop loading
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true); // Start loading

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

        try {
            const response = await axios.post(URL, formData);
            toast.success(response.data.message);

            if (response.data.success) {
                setFormData({
                    name: "",
                    email: "",
                    password: ""
                });
                switchToLogin();
                setLoading(false); 
            }

        } catch (error) {
            toast.error("3",error?.response?.data?.message || "An error occurred");
            setLoading(false); 
        }
    };

    const switchToRegister = () => {
        setIsLogin(false);
    };

    const switchToLogin = () => {
        setIsLogin(true);
    };

    return (
        <div className="login-page-background">
            <img src={logo} alt="Logo" className="form-logo" />
            {loading ? (
                <div className="loading-spinner">Loading...</div> 
            ) : (
                <div className={`wrapper ${isLogin ? '' : 'active'}`}>
                    <div className="form-box login">
                    <form onSubmit={handleLoginSubmit}>
                            <h1>Login</h1>
                            <div className="input-box">
                                <input 
                                    type="email" 
                                    name='email'
                                    placeholder='Email' 
                                    value={formData.email}
                                    onChange={handleOnChange}
                                    required 
                                />
                                <IoIosMail className='icon' />
                            </div>
                            <div className="input-box">
                                <input 
                                    type="password" 
                                    name='password'
                                    placeholder='Password' 
                                    value={formData.password}
                                    onChange={handleOnChange}
                                    required 
                                />
                                <FaLock className='icon' />
                            </div>
                            <div className="remember-forgot">
                                <label> <input type="checkbox" /> Remember me</label>
                                <a href="#">Forgot password?</a>
                            </div>
                            <button type="submit" className="btn">
                                <strong>Login</strong>
                                <div id="container-stars">
                                    <div id="stars"></div>
                                </div>
                                <div id="glow">
                                    <div className="circle"></div>
                                    <div className="circle"></div>
                                </div>
                            </button>
                            <div className='form-footer'>
                                <div className="register-link">
                                    <p>Don't have an account yet? <a href="#" onClick={switchToRegister}>Sign Up</a></p>
                                </div>
                            </div>
                        </form>

                    </div>

                    <div className="form-box register">
                    <form onSubmit={handleRegisterSubmit}>
                                <h1>Sign Up</h1>
                                <div className="input-box">
                                    <input
                                        type="text"
                                        name='name'
                                        placeholder='Username'
                                        value={formData.name}
                                        onChange={handleOnChange}
                                        required 
                                    />
                                    <FaUser className='icon' />
                                </div>
                                <div className="input-box">
                                    <input
                                        type="email"
                                        name='email'
                                        placeholder='Email'
                                        value={formData.email}
                                        onChange={handleOnChange}
                                        required 
                                    />
                                    <IoIosMail className='icon' />
                                </div>
                                <div className="input-box">
                                    <input
                                        type="password"
                                        name='password'
                                        placeholder='Password'
                                        value={formData.password}
                                        onChange={handleOnChange}
                                        required 
                                    />
                                    <FaLock className='icon' />
                                </div>
                                <button type="submit" className="btn">
                                    <strong>Sign Up</strong>
                                    <div id="container-stars">
                                        <div id="stars"></div>
                                    </div>
                                    <div id="glow">
                                        <div className="circle"></div>
                                        <div className="circle"></div>
                                    </div>
                                </button>
                                <div className="form-footer">
                                    <div className="register-link">
                                        <p>Already have an account? <a href="#" onClick={switchToLogin}>Login</a></p>
                                    </div>
                                </div>
                            </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginRegister;

import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const Login = () => {
    const useFormInput = initialValue=>{
        const [value,setValue] = useState(initialValue);
        const handleChange = e =>{
            setValue(e.target.value);
        }
        return{
            value,
            onChange:handleChange
        }
    }
    const authConext = useContext(AuthContext);
    const email = useFormInput('');
    const password = useFormInput('');
    const [error,setError] = useState(false);
    const [redirectToHome,setRedirectToHome] = useState(false);

    const handleLogin = async ()=>{
        try{
            //input validation!
            let apiRes = await axios.post('/users/signin',{email:email.value,password:password.value});
            if(!apiRes.data.error){
                let loggedInuser = {
                    firstName:apiRes.data.data.firstName,
                    lastName:apiRes.data.data.lastName,
                    userId:apiRes.data.data._id
                }
                authConext.setAuthState({
                    logged:true,
                    user:loggedInuser
                })
                setRedirectToHome(true);
            }
        }catch(e){
            console.log(e);
        }

    }
    if(redirectToHome){
        return <Redirect to='/' />
    }else{
        return (
            <div>
                <div className='login-card' key='login'>
                <div className='card-body'>
                    <h2 className='card-title'>
                        Log In
                    </h2>
                    <label>Email</label><br/>
                    <input type='email' {...email} name='email' placeholder='Email'/><br/>
                    <label>Password</label><br/>
                    <input type='password' {...password} name='password' placeholder='Password'/><br/>
                    <br/>
                    <input type = 'button' className = 'submit-button' value = 'submit' onClick={handleLogin}/>
                </div>
                </div>
            </div>
        );
    }
};

export default Login;
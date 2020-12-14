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
    const [errors,setErrors] = useState(undefined);
    const [redirectToHome,setRedirectToHome] = useState(false);
    let errorArea;
    const handleLogin = async ()=>{
        let inputErrors = [];
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email.value||!emailRegex.test(email.value)) inputErrors.push('invalid email');
        if(!password.value) inputErrors.push('Need password');
        if(inputErrors.length>0){
            setError(true);
            setErrors(inputErrors);
        }else{
            try{
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
                }else{
                    inputErrors = apiRes.data.errors;
                    setError(true);
                    setErrors(inputErrors);
                }
            }catch(e){
                inputErrors = e;
                setError(true);
                setErrors(inputErrors);
            }
        }

    }
    const buildError = (e)=>{
        return(
            <li>{e}</li>
        )
    }
    errorArea = error&&errors&&errors.map((e)=>{
        return buildError(e);
    })
    if(redirectToHome){
        return <Redirect to='/' />
    }else if(error&&errors){
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
                    <div className='error-area'>
                    <ul>
                        {errorArea}
                    </ul>
                    </div>
                    <input type = 'button' className = 'submit-button' value = 'submit' onClick={handleLogin}/>
                </div>
                </div>
            </div>
        );
    }else{
        return(
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
        )

    }
};

export default Login;
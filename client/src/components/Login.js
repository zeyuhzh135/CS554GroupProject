import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';

const Login = (props) => {
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
    const email = useFormInput('');
    const password = useFormInput('');
    const [error,setError] = useState(false);
    const [redirectToHome,setRedirectToHome] = useState(false);

    const handleLogin = async ()=>{
        try{
            //input validation!
            let apiRes = await axios.post('/users/signin',{email:email.value,password:password.value});
            if(!apiRes.data.error){
                props.history.push({
                    pathname:'/',
                    authUser:{
                        userId:apiRes.data.data._id,
                        firstNamme:apiRes.data.data.firstNamme,
                        lastName:apiRes.data.data.lastName
                    }
                });
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
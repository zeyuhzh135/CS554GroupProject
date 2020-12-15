import axios from 'axios';
import React, { useState,useEffect, useContext } from 'react';
import {NavLink as Link} from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';

const Nav = () => {
    const authContext = useContext(AuthContext);
    const [auth,setAuth] = useState(false);
    const [authUser, setAuthUser] = useState(undefined);
    useEffect(()=>{
        const getUser = async ()=>{
            let theUser;
            try{
                theUser = await axios.get('/users/profile');
                if(theUser.data.logged) setAuth(true);
                if(theUser.data.logged && theUser.data.data){
                    setAuthUser({
                        id:theUser.data.data._id,
                        firstName:theUser.data.data.firstName,
                        lastName:theUser.data.data.lastName
                    });
                }
            }catch(e){
                console.log(e);
            }
        }
        getUser();
    },[authContext.authState]);
    
    if(auth&&authUser&&authContext.authState.logged){
        console.log(authContext.authState);
        return(
            <div className='navbar'>
                <Link className='navlink' to='/'>
                    Home
                </Link>
                <Link className='navlink' to='/classes'>
                    Quizes
                </Link>
                <Link className='navlink' to='/chatRoom'>
                    ChatRoom
                </Link>
                <Link className='loglink' to='/dashboard'>
                    {authUser.firstName} {authUser.lastName}
                </Link>
            </div>
        )
    }else{
        return(
            <div className='navbar'>
                <Link className='navlink' to='/'>
                    Home
                </Link>
                <Link className='navlink' to='/classes'>
                    Quizes
                </Link>
                <Link className='navlink' to='/chatRoom'>
                    ChatRoom
                </Link>
            <Link className='loginlink' to='/login'>
                SignIn
            </Link>
            <Link className='loglink' to='/register'>
                SignUp
            </Link> 
            </div>
            )
    }
};

export default Nav;
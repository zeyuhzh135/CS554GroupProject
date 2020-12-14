import axios from 'axios';
import React, { useState,useEffect } from 'react';
import {NavLink as Link} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import './App.css';

const Nav = (props) => {
    const [auth,setAuth] = useState(false);
    const [authUser, setAuthUser] = useState(undefined);
    useEffect( async ()=>{
        const theUser = await axios.get('/users/profile');
        if(theUser.data.logged) setAuth(true);
        if(theUser.data.logged && theUser.data.data){
            setAuthUser({
                id:theUser.data.data._id,
                firstName:theUser.data.data.firstName,
                lastName:theUser.data.data.lastName
            });
        }
    },[props.location]);
    if(auth&&authUser){
        console.log(props.location);
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
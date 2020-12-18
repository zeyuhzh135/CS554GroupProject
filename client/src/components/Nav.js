import axios from 'axios';
import React, { useState,useEffect, useContext } from 'react';
import {NavLink as Link} from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';

const Nav = () => {
    const authContext = useContext(AuthContext);
    const [authUser, setAuthUser] = useState(undefined);
    useEffect(()=>{
        const getUser = async ()=>{
            let theUser;
            try{
                theUser = await axios.get('/users/profile');
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
    
    if(authUser&&authContext.authState.logged){
        //console.log(authContext.authState);
        return(
            <div className='navbar'>
                <Link className='navlink' to='/'>
                <h1 className = "title">Quiz App</h1>
                </Link>
                <Link className='navlink' to='/classes'>
                    Quizzes
                </Link>
                <Link className='navlink' to='/chatRoom'>
                    Chat Room
                </Link>
                <Link className='navlink' to='/dashboard'>
                    My Dashboard
                </Link>
            </div>
        )
    }else{
        return(
            <div className='navbar'>
                <Link className='navlink' to='/'>
                <h1 className = "title">Quiz App</h1>
                </Link>
                <Link className='navlink' to='/classes'>
                    Quizzes
                </Link>
                <Link className='navlink' to='/chatRoom'>
                    Chat Room
                </Link>
            <Link className='navlink' to='/login'>
                Sign In
            </Link>
            <Link className='navlink' to='/register'>
                Sign Up
            </Link> 
            </div>
            )
    }
};

export default Nav;
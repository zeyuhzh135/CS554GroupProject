import axios from 'axios';
import React, { useState ,useEffect, useContext} from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';

const Dashboard = ()=>{
    const authContext = useContext(AuthContext);
    const [auth,setAuth] = useState(false);
    const [authUser, setAuthUser] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [redirectToSignIn, setRedirectToSignIn] = useState(false);
    const [loggedOut,setLoggedOut] = useState(false);
    const handleLogout = async ()=>{
        const loggingout = await axios.get('/users/logout');
        if(loggingout){
            authContext.setAuthState({
                logged:false,
                user:undefined
            });
            //console.log(authContext.authState);
            setLoggedOut(true);
        }
    }
    useEffect( async ()=>{
        const theUser = await axios.get('/users/profile');
        if(theUser.data.logged){
            setAuth(true);
            setRedirectToSignIn(false);
            setLoggedOut(false);
        }else{
            setAuth(false);
            setRedirectToSignIn(true);
        }
        if(theUser.data.logged && theUser.data.data){
            setAuthUser({
                id:theUser.data.data._id,
                firstName:theUser.data.data.firstName,
                lastName:theUser.data.data.lastName,
                classes:theUser.data.data.classes,
                scores:theUser.data.data.scores
            });
        }
        setLoading(false);
    },[]);

    if(loading){
        return <p>Loading...</p>
    }else if(redirectToSignIn){
        return <Redirect to='/login'/>
    }else if(loggedOut){
        return <Redirect to='/'/>
    }else if(auth){
        return(
            <div>
                <p>Welcome,{authUser.firstName} {authUser.lastName}</p>
                <p>My scores:</p>
                <p>{authUser.scores}</p>
                <p>My quizes:</p>
                <p>{authUser.classes}</p>
                <input type='button' className='logout-button' value='Log out' onClick={handleLogout}/>
            </div>
        )
    }

}

export default Dashboard;
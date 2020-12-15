import axios from 'axios';
import React, { useState ,useEffect, useContext} from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';
import Score from './Score';


const Dashboard = ()=>{
    const authContext = useContext(AuthContext);
    const [auth,setAuth] = useState(false);
    const [authUser, setAuthUser] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [redirectToSignIn, setRedirectToSignIn] = useState(false);
    const [loggedOut,setLoggedOut] = useState(false);
    let scores;
    let Imteaching;
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

    const handleEmail = async(e)=>{
        e.preventDefault();
        console.log(authUser.showScores);
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
            let showClasses = [];
            let showScores = [];
            for(let c of theUser.data.data.classes){
                const theC = await axios.get(`/classes/${c}`);
                showClasses.push({
                    classId: theC.data.data._id,
                    className: theC.data.data.name
                });
            }
            for(let s of theUser.data.data.scores){
                const theS = await axios.get(`/classes/${s.classId}`);
                showScores.push({
                    classId:theS.data.data._id,
                    className:theS.data.data.name,
                    score: s.score
                })
            }
            setAuthUser({
                id:theUser.data.data._id,
                firstName:theUser.data.data.firstName,
                lastName:theUser.data.data.lastName,
                classes:theUser.data.data.classes,
                showClasses:showClasses,
                scores:theUser.data.data.scores,
                showScores:showScores
            });
        }
        setLoading(false);
    },[]);

    const buildscores=(showScores)=>showScores.map((showscore)=>{
        return(
            <Score showscore={showscore}/>
        )
    })

    const buildclasses=(showClasses)=>showClasses.map((showquiz)=>{
        return(
            <div>
                <p>{showquiz.className}</p>
            </div>
        )
    })


    if(loading){
        return <p>Loading...</p>
    }else if(redirectToSignIn){
        return <Redirect to='/login'/>
    }else if(loggedOut){
        return <Redirect to='/'/>
    }else if(auth){
        scores = auth&&authUser.showScores&& buildscores(authUser.showScores);
        Imteaching = auth&&authUser.showClasses&& buildclasses(authUser.showClasses);
        return(
            <div>
                <p>Welcome,{authUser.firstName} {authUser.lastName}</p>
                <p>My scores:</p>
                {scores}
                <form onSubmit={handleEmail}>
                    <input type='submit' value='Send my scores to email'/>
                </form>
                <p>I am teaching:</p>
                {Imteaching}
                <input type='button' className='logout-button' value='Log out' onClick={handleLogout}/>
            </div>
        )
    }

}

export default Dashboard;
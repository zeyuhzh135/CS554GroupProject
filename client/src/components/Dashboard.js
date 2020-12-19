import axios from 'axios';
import React, { useState ,useEffect, useContext} from 'react';
import { Redirect,Link } from 'react-router-dom';
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
    const [imageLoad,setImageLoad] = useState(false);
    let scores;
    let Imteaching;
    const handleLogout = async ()=>{
        const loggingout = await axios.get('/users/logout');
        if(loggingout){
            localStorage.removeItem("cs554-fp-logged");
            localStorage.removeItem("cs554-fp-logged");
            authContext.setAuthState({
                logged:false,
                user:{}
            });           
            //console.log(authContext.authState);
            setLoggedOut(true);
        }
    }

    const handleEmail = async(e)=>{
        e.preventDefault();
        console.log(authUser.showScores);
        try{
            let t1 = await axios.post('/users/email-score',authUser.showScores);
            if(!t1.error) alert('An email has been sent')
            else alert('Unable to send the email')
        }catch(e){
            alert('Unable to send the email')
        }

    }

    const imageRender = (hasPicture) => {
        if(hasPicture){
            return <img src={'/image/get?id='+authUser.id+'&type=user'} alt="user image"/>
        }else {
            return <img src={'https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-600w-418179865.jpg'} alt="user image"/>
        }
    }
    useEffect( async ()=>{
        setAuth(false);
        setAuthUser(undefined);
        setImageLoad(false);
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
            for(let c of theUser.data.data.teaching){
                const theC = await axios.get(`/classes/${c}`);
                showClasses.push({
                    classId: theC.data.data._id,
                    className: theC.data.data.name
                });
            }
            for(let s of theUser.data.data.scores){
                const theS = await axios.get(`/classes/${s.classId}`);
                showScores.push({
                    classId:s.classId,
                    className:theS.data.data.name,
                    score: s.score,
                    scoreboard:s.scoreboard
                })
            }
            setAuthUser({
                id:theUser.data.data._id,
                firstName:theUser.data.data.firstName,
                lastName:theUser.data.data.lastName,
                city:theUser.data.data.city,
                email:theUser.data.data.email,
                state:theUser.data.data.state,
                hasPicture:theUser.data.data.hasPicture,
                active:theUser.data.data.active,
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
        // let imagescr;
        // if(authUser.hasPicture){
        //     imagescr = '/image/get?id='+authUser.id+'&type=user'
        // }else{
        //     imagescr = 'https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-600w-418179865.jpg'
        // }
        return(
            <div>
                <h1>Welcome,{authUser.firstName} {authUser.lastName}</h1>
                <div>
                  {authUser&&imageRender(authUser.hasPicture)}  
                  {/* {imageLoad?null:<div style={{background:'red',height:'200',width:'200'}}/>}
                  <img style = {imageLoad?{}:{display:'loading image'}} src={imagescr} onLoad={()=>setImageLoad(true)}/> */}
                </div>
                <div className='information-card'>
                    <div className='information-card-body'>
                        <p>{authUser.firstName} {authUser.lastName}</p>
                        <p>{authUser.email}</p>
                        <p>{authUser.city}</p>
                        <p>{authUser.state}</p> 
                    </div>
                   <Link className = 'regularlink' to='/profile/edit'>Edit my profile</Link> 
                </div>
                
                <div className = 'score-card'>
                    <p>My scores:</p>
                    {scores}
                    <br/>
                    <form onSubmit={handleEmail}>
                        <input type='submit' value='Send transcripts to my email'/>
                    </form> 
                    <br/>
                </div>
                
                <div className='score-card'>
                    <p>I am teaching:</p>
                    {Imteaching}
                    <br/>
                </div>
                  <div>
                     <input type='button' className='logout-button' value='Log out' onClick={handleLogout}/> 
                  </div>
                
            </div>
        )
    }

}

export default Dashboard;
import React, { useEffect, useState,useLayoutEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';
import axios from 'axios';

const EmailVarification = (props)=>{
    const [varified,setVarified] = useState(false);
    const [loading,setLoading] = useState(true);
    //const [checkedInvalidurl,setcheckedInvalidurl] = useState(false);
    const [invalidurl,setInvalidurl] = useState(false);
    const [authUser,setAuthUser] = useState(undefined);
    const [error, setError] = useState(false);

    useLayoutEffect(()=>{
        setLoading(true);
        console.log('start');
        async function varifyurl(){
            let apires
            try{
               apires = await axios.get(`/users/profile/${props.match.params.id}`);
            if(apires&&!apires.error&&!apires.data.data.active){
                setAuthUser(apires.data.data);
            }else if(apires&&!apires.valid){
                setError(true)
            }
            }catch(e){
                setError(true);
            }  

        }
       varifyurl();
        console.log(invalidurl);
        console.log('end');
        setLoading(false);
    },[]);

    const handleActive=async (e)=>{
        e.preventDefault();
        try{
            let apire = await axios.post('/users/active',{userId:authUser._id});
            if(!apire.data.error){
                alert("Successfully activate your account");
                props.history.push('/login');
                
            }else{
                props.history.push('/404');
                
            }
        }catch(e){
            props.history.push('/404');
            
        }
        
    }

    if(!authUser){
        return(
            <p>User not exist</p>
        )
    }else{
        return(
        <div>
            <p>{authUser.firstName} {authUser.lastName}</p>
            <p>Click the button to active your account</p>
            <form onSubmit={handleActive}>
                <input type="submit" value="Active"/>
            </form>
        </div>

    )
    }


}

export default EmailVarification;
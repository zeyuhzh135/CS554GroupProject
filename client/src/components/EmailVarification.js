import React, {useState,useLayoutEffect } from 'react';
import './App.css';
import axios from 'axios';

const EmailVarification = (props)=>{
    const [loading,setLoading] = useState(true);
    //const [checkedInvalidurl,setcheckedInvalidurl] = useState(false);
    const [authUser,setAuthUser] = useState(undefined);

    useLayoutEffect(()=>{
        setLoading(true);
        async function varifyurl(){
            let apires
            try{
               apires = await axios.get(`/users/profile/${props.match.params.id}`);
            if(apires&&!apires.error&&!apires.data.data.active){
                setAuthUser(apires.data.data);
            }else if(apires&&!apires.valid){
                props.history.push('/404');
            }
            }catch(e){
                props.history.push('/404');
            }  

        }
       varifyurl();
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
            <p>Page not exist</p>
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
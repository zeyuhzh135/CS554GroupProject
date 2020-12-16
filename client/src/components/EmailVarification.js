import React, { useContext, useEffect, useState,useLayoutEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';
import axios from 'axios';

const EmailVarification = (props)=>{
    const [varified,setVarified] = useState(false);
    const [loading,setLoading] = useState(true);
    //const [checkedInvalidurl,setcheckedInvalidurl] = useState(false);
    const [invalidurl,setInvalidurl] = useState(false);
    const [firstResponse,setFirstResponse] = useState(undefined);

    useLayoutEffect(()=>{
        setLoading(true);
        console.log('start');
        async function varifyurl(){
            let apires
            try{
               apires = await axios.get(`/users/varification/${props.match.params.id}`);
            if(apires&&!apires.error&&apires.valid){
                console.log(apires);
                setVarified(true);
                setInvalidurl(false);
            }else if(apires&&!apires.valid){
                console.log(apires);
                setVarified(false);
                setInvalidurl(true);
            }
               return apires;
            }catch(e){
                setInvalidurl(true);
            }  

        }
       varifyurl();
        console.log(invalidurl);
        console.log('end');
        setLoading(false);
    },[props.match.params.id]);

    return(
        <div>
            <p>{invalidurl}</p>
            <p>{props.match.params.id}</p>
        </div>

    )

}

export default EmailVarification;
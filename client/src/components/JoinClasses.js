import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom';
import './App.css';

const JoinClasses = () => {
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
    const [classList, setClassList] = useState(undefined);
    const [loading, setLoading] = useState(true)
    const classId = useFormInput('');
    let classes;
    useEffect(async ()=>{
        async function getclasses(){
            try{
                let apires = await axios.get('/classes');
                setClassList(apires.data.data);
            }catch(e){
                console.log(e);
            }
        }
        getclasses()
        setLoading(false)
    },[]);
    let handleJoin = async (e)=>{
        e.preventDefault()
        try{
            let apiResponse = await axios.post('/users/joinClass',{classId:classId.value});
            if(!apiResponse.data.error){
                alert("join success");
            }
        }catch(e){
            console.log(e);
        }
    }
    if(loading){
        return (
            <div>
                <p>loading</p>
            </div>
        )
    }else {
        return (
            <div>
                <div className='register-card' key='register'>
                    <div className='card-body'>
                        <h2 className='card-title'>
                            Register
                        </h2>
                        <div>
                            <label>Class</label><br/>
                            <select name = 'class' {...classId} id='class'>
                                <option value="" defaultValue="selected">Select a Class</option>
                                {classList && classList.map((_class)=>{
                                    return <option value={_class._id}>{_class.name}</option>
                                })}
                            </select>
                            <br/>
                            <br/>
                            <input type = 'button' className = 'submit-button' value = 'join' onClick={handleJoin}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default JoinClasses;
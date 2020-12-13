import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

function ChatNav() {

    const [classes, setClasses] = useState(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        async function getUserInfo(){
            let apiRes = await axios.get('/users/profile');
            if(!apiRes.data.error){
                let user = apiRes.data.data;
                let tempClasses = [];
                user.classes.map(async (classId)=>{
                    let Res = await axios.get(`/classes/${classId}`);
                    let _class = Res.data.data;
                    console.log(_class);
                    tempClasses.push(_class);
                })
                setClasses(tempClasses);
                setLoading(false);
            }
        }
        getUserInfo();
    },[])

    if(!loading){
        return (
            <div>
                <ul>
                    {classes.map((_class)=>{
                        return <li>{_class.name}</li>
                    })}
                </ul>
            </div>
        );
    }else{
        return (
            <div>
                <p>loading</p>
            </div>
        )
    }
}

export default ChatNav;
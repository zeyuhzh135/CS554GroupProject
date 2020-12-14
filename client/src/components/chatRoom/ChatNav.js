import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const ChatNav = ()=> {

    const [classes, setClasses] = useState(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(async ()=>{
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
                        return <li key={_class._id}><Link to={`/chat?room=${_class._id}&name=${_class.name}`}>{_class.name}</Link></li>
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
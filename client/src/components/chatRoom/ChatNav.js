import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const ChatNav = ()=> {

    const [classes, setClasses] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState(undefined);
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
                setUserName(user.lastName+" "+user.firstName);
                setClasses(tempClasses);
                setLoading(false);
            }
        }
        getUserInfo();
    },[])

    useEffect(()=>{

    },[loading])


        return (
            <div>
                <ul>
                    {classes && classes.map((_class)=>{
                        return <li key={_class._id}><Link to={`/chat?roomId=${_class._id}&name=${_class.name}&userName=${userName}`}>{_class.name}</Link></li>
                    })}
                </ul>
            </div>
        );

}

export default ChatNav;
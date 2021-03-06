import React, {useState, useEffect,useContext} from 'react';
import axios from 'axios';
import {Link, Redirect} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const ChatNav = () => {
    const authContext = useContext(AuthContext);
    const [classes, setClasses] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState(undefined);
    useEffect(() => {
        setLoading(true)
        async function getUserInfo() {
            let apiRes = await axios.get('/users/profile');
            if (!apiRes.data.error) {
                let user = apiRes.data.data;
                let tempClasses = [];
                await Promise.all(user.classes.map(async (classId) => {
                    let Res = await axios.get(`/classes/${classId}`);
                    let _class = Res.data.data;
                    //console.log(_class);
                    tempClasses.push(_class);
                }))
                setUserName(user.lastName + " " + user.firstName);
                setClasses(tempClasses)
            }
        }
        getUserInfo();
    },[])

    useEffect(()=>{
        if(classes!==undefined)
            setLoading(false);
    },[classes])

    if(classes===undefined){
        return(
            <p>loading..</p>
        )
    }
    
    if(authContext.authState&&authContext.authState.logged){
        //console.log(classes)
        return (
        <div>
            <h1>{authContext.authState.user.firstName} {authContext.authState.user.lastName}</h1>
            <div className="chatrooms">
                <ul>
                {classes&&classes.map((_class) => {
                    return (
                    <div className = 'quiz-card'>
                        <li key={_class._id}>
                            <h2 className='quiz-title' key = {_class.name}>
                                {_class.name}
                            </h2>
                            <p className='quiz-cate' key= {_class.category}>
                                Category:
                                {_class.category}
                            </p>
                            <p className='quiz-description' key={_class.description}>
                                Description:
                                {_class.description}
                            </p>
                            <Link className='start-quiz' to={`/chat?roomId=${_class._id}&name=${_class.name}&userName=${userName}`}>Join Chatroom</Link>
                        </li>
                    </div>
                );})}
            </ul> 
            </div>

        </div>
     );
    }else{
        return(
            <Redirect to='/login'/>
        )
    }


}

export default ChatNav;
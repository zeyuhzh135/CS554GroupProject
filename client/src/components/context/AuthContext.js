import React, {useState, createContext, useEffect} from 'react';
import axios from 'axios'

const AuthContext = createContext();
const {Provider} = AuthContext;

const AuthProvider = ({children})=>{
    // const logged = localStorage.getItem("cs554-fp-logged");
    // const userInfo = localStorage.getItem("cs554-fp-user")
    // const [authState, setAuthState] = useState({
    //     logged:logged,
    //     user:userInfo?JSON.parse(userInfo):{}
    // })

    const [authState, setAuthState] = useState({
        logged:false,
        user:undefined,
    })

    const [pending, setPending] = useState(true);
    const setAuth = ({logged,user})=>{
    setAuthState({
        logged:logged,
        user:user
        })
    }

    useEffect(()=>{
        async function getTheUser(){
            let theU = await axios.get('/users/profile');
            setAuth({logged:theU.data.logged,user:theU.data.data});
            setPending(false);
        }
        getTheUser()
    },[]);

    if(pending){
        return <div>Loading...</div>
    }
    return (
        <Provider
            value = {{
                authState,
                setAuthState:authInfo => setAuth(authInfo)
            }}
        >
            {children}
        </Provider>
    
    )
}





export { AuthContext, AuthProvider };
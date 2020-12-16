import React, {useState, createContext} from 'react';

const AuthContext = createContext();
const {Provider} = AuthContext;

const AuthProvider = ({children})=>{
    const logged = localStorage.getItem("cs554-fp-logged");
    const userInfo = localStorage.getItem("cs554-fp-user")
    const [authState, setAuthState] = useState({
        logged:logged,
        user:userInfo?JSON.parse(userInfo):{}
    })
    const setAuth = ({logged,user})=>{
    localStorage.setItem("cs554-fp-logged", logged);
    localStorage.setItem("cs554-fp-user",JSON.stringify(user));
    setAuthState({
        logged,
        user
        })
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
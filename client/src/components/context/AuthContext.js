import React, {useState, createContext} from 'react';

const AuthContext = createContext();
const {Provider} = AuthContext;

const AuthProvider = ({children})=>{
    const [authState, setAuthState] = useState({
        logged:false,
        user:undefined
    })
    const setAuth = ({logged,user})=>{
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
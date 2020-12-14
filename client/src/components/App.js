import './App.css';
import React, { useEffect, useState } from 'react';
import {NavLink, BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import {AuthContext, AuthProvider} from './context/AuthContext';
import chatRoom from "./chatRoom/ChatRoom";
import JoinClasses from "./JoinClasses";
import Dashboard  from "./Dashboard";
import Nav from './Nav';
import axios from 'axios';


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <div className="App">
                        <header className="App-header">
                        {/*<h1 className="App-title">Quiz App</h1>*/}
                        <div className="App-link">
                            <Nav/>
                        </div>
                    </header>
                </div>
                <br/>
                <br/>
                <div className='App-body'>
                    <Route exact path='/' render={props=><Home route='/'/>} />
                    <Route exact path='/login' component={Login}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/chatRoom' render={chatRoom}/>
                    <Route path='/dashboard' component={Dashboard}/>
                </div>
            </div>   
            </AuthProvider>
 
        </Router>

        // [<Switch>
        //     < Route component = {Nav}/>
        // </Switch>,
        // <Switch>
        //     <Route exact path='/' component={Home}/>
        //     <Route exact path='/login' component={Login}/>
        //     <Route path='/register' component={Register}/>
        //     <Route path='/chatRoom' render={chatRoom}/>
        //     <Route path='/dashboard' component={Dashboard}/>
        // </Switch>
        // ]

    );
}

export default App;

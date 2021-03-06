import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Home';
import ClassPage from './ClassPage';
import Login from './Login';
import Register from './Register';
import {AuthProvider} from './context/AuthContext';
import Dashboard  from "./Dashboard";
import Nav from './Nav';
import ChatNav from "./chatRoom/ChatNav";
import ChatRoom from "./chatRoom/ChatRoom";
import QuizWork from "./QuizWork";
import NewQuiz from './NewQuiz';
// import EditQuiz from './QuizEdit';
import EditProfile from './EditProfile';
import EmailVarification from './EmailVarification';
import PrivateRoute from './PrivateRoute';
import ScoreBoard from './ScoreBoard'


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
                    <PrivateRoute exact path='/' component={Home} />
                    <PrivateRoute exact path='/Classes' component={ClassPage}/>
                    <Route exact path='/login' component={Login}/>
                    <Route path='/register' component={Register}/>
                    <PrivateRoute path='/chatRoom' component={ChatNav}/>
                    <PrivateRoute path='/chat' component={ChatRoom}/>
                    <PrivateRoute path='/dashboard' component={Dashboard}/>
                    <PrivateRoute exact path='/quiz/:id' component={QuizWork}/>
                    <PrivateRoute exact path='/newquiz' component={NewQuiz}/>
                    <PrivateRoute exact path='/profile/edit' component={EditProfile}/>
                    <Route exact path='/varification/:id' component={EmailVarification}/>
                    <PrivateRoute path='/scoreboard/:quizId' component={ScoreBoard}/>
                </div>
            </div>   
            </AuthProvider>
 
        </Router>


    );
}

export default App;

import './App.css';
import React from 'react';
import { NavLink, BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import {AuthContext} from './context/AuthContext';


function App() {
  return (
    <div className="App">
      <Router>   
      <div className="App">
          <header className="App-header">
            <h1 className="App-title">Quiz App</h1>
              <Link className='navlink' to='/'>
                Home
              </Link>
              <Link className='navlink' to='/classes'>
                Classes
              </Link>
              <Link className='loglink' to='/login'>
              SignIn
              </Link>
              <Link className='loglink' to='/register'>
              SignUp
              </Link>
          </header>
          </div>
          <br/>
          <br/>
          <div className='App-body'>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
        </div>
      </Router>
    </div>
  );
}

export default App;

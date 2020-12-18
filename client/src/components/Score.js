import React, { useContext, useState } from 'react';
import { Redirect,Link } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const Score = (props)=>{
    const [quizId, setQuizId] = useState(props.showscore.classId);
    const [quizName, setQuizName] = useState(props.showscore.className);
    const [quizScore,setQuizScore] = useState(props.showscore.score);

    return(
        <div>
            <Link to={`/scoreboard/${quizId}`}>{quizName}: {quizScore}</Link>
            <br/>
        </div>
          
        
    )
}

export default Score;
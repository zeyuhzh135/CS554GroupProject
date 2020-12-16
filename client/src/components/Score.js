import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const Score = (props)=>{
    const [quizId, setQuizId] = useState(props.showscore.classid);
    const [quizName, setQuizName] = useState(props.showscore.className);
    const [quizScore,setQuizScore] = useState(props.showscore.score);

    return(
          <li key={quizId}>{quizName}: {quizScore}</li>  
        
    )
}

export default Score;
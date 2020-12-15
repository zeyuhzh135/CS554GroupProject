import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';

const NewQuiz = () => {
    return(
        <div className="new-quiz">
            <form className='new-quiz-form'>
                <p>NewQuiz</p>
            </form>
        </div>
    )
}

export default NewQuiz;

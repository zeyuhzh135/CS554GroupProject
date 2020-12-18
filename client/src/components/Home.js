import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';

const Home = (props) => {
	const authContext = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [classList, setClassList] = useState(undefined);
	const [theUser,settheUser] = useState(undefined);
	let classes;
	let newQuiz;
	useEffect( ()=>{
		setLoading(true);
		async function getclasses(){
			try{
				let apires = await axios.get('/classes');
				setClassList(apires.data.data);
			}catch(e){
				console.log(e);
			}
		}
		async function getUser(){
			try{
				let theU = await axios.get('/users/profile');
				settheUser(theU.data.data);
			}catch(e){
				console.log(e);
			}
		}
		getclasses();
		getUser();
	},[]);

	let handleJoin = async (e, classId)=>{
		e.preventDefault()
		try{
			let apiResponse = await axios.post('/users/joinClass',{classId: classId, userID: theUser._id});
            if(!apiResponse.data.error){
				alert("join success");
				props.history.push('/chatRoom');
			}
        }catch(e){
            console.log(e);
        }
    }

	const buildButton = (theClass) =>{
		if(authContext.authState&&authContext.authState.logged&&theUser&&theUser._id===theClass.owner){
			return(
				<p> I am the teacher of this quiz</p>
	
			)
		}else if(authContext.authState&&authContext.authState.logged&&theUser){
			let joinClass = false;
			let startquiz = false;
			if(theUser.classes.includes(theClass._id)){
				joinClass=true;
			}
			for(let s of theUser.scores){
				console.log(s);
				if(s.classId===theClass._id){
					startquiz = true;
				}
				break;
			}
			let JoinButton = null;
			let startButton = null;
			if(!joinClass){
				JoinButton= <Link className='start-quiz' onClick={(e) => handleJoin(e, theClass._id)}>
					Join Chat
				</Link>
			}
			if(!startquiz){
				startButton = <Link className='start-quiz' to={`/quiz/${theClass._id}`}>
					Start quiz
				</Link>
			}else{
				startButton= <Link className='start-quiz' to={`/scoreboard/${theClass._id}`}>Quiz Score</Link>
			}

			return(
				<div>
					{JoinButton}
					{startButton}
				</div>
			)
		}else{
			return null;
		}
	}
	const buildNewQuizLink = ()=>{
		return(
			<Link to='/newquiz'>Create a New Quiz</Link>
		)
	}
	const buildClass = (theClass)=>{
		const actionButton = buildButton(theClass);
		return(
			<li key = {theClass._id}>
				<div className = 'quiz-card' key = {theClass._id}>
					<h2 className='quiz-title' key = {theClass.name}>
						{theClass.name}
					</h2>
					<p className='quiz-cate' key= {theClass.category}>
						Category:
						{theClass.category}
					</p>
					<p className='quiz-description' key={theClass.description}>
						Description:
						{theClass.description}
					</p>
					<br/>
					<div>
						{actionButton}
					</div>
				</div>

			</li>
		)
	}
	classes = classList && classList.map((theClass)=>{
		return buildClass(theClass);
	});
	if(authContext.authState&&authContext.authState.logged&&theUser&&theUser.isteacher){
		newQuiz = buildNewQuizLink()
	}
	return (
		<div>
			{newQuiz}
			<br/>
			<ul>
				{classes}
			</ul>
		</div>
	);
};

export default Home;
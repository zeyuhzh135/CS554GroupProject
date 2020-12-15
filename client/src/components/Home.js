import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';

const Home = () => {
	const authContext = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [classList, setClassList] = useState(undefined);
	const [theUser,settheUser] = useState(undefined);
	let classes;
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
		getclasses()
	},[]);

	const buildButton = (theClass) =>{
		if(authContext.authState&&authContext.authState.logged&&theClass.owner===authContext.authState.user.userId){
			return(
				<Link className='edit-quiz'>
					Edit quiz
				</Link>	
			)
		}else if(authContext.authState&&authContext.authState.logged){
			return(
				<Link className='start-quiz' to={`/quiz/${theClass._id}`}>
					Start quiz
				</Link>
			)
		}else{
			return null;
		}
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
	return (
		<div>
			<ul>
				{classes}
			</ul>
		</div>
	);
};

export default Home;
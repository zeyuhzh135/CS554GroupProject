import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom';
import './App.css';

const Home = () => {
	const [loading, setLoading] = useState(false);
	const [classList, setClassList] = useState(undefined);
	const [theUser,settheUser] = useState(undefined);
	let classes;
	useEffect(()=>{
		setLoading(true);
		async function getclasses(){
			try{
				let apires = await axios.get('http://localhost:4000/classes');
				setClassList(apires.data.data);
				settheUser(apires.data.data.user);
			}catch(e){
				console.log(e);
			}
		}
		getclasses()
	},[]);
	const buildClass = (theClass)=>{
		return(
			<li key = {theClass._id}>
				<Link to={`/classes/${theClass._id}`}>
					{theClass.name}
				</Link>
			</li>
		)
	}
	classes = classList && classList.map((theClass)=>{
		return buildClass(theClass);
	})
	return (
		<div>
			<ul>
				{classes}
			</ul>
		</div>
	);
};

export default Home;
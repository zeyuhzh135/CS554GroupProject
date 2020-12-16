import React, { useContext, useState } from 'react';
import './App.css'; 
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const Register = () => {
    const useFormInput = initialValue=>{
        const [value,setValue] = useState(initialValue);
        const handleChange = e =>{
            setValue(e.target.value);
        }
        return{
            value,
            onChange:handleChange
        }
    }
    const authContext = useContext(AuthContext);
    const firstName = useFormInput('');
    const lastName = useFormInput('');
    const email = useFormInput('');
    const password = useFormInput('');
    const confirmedPasseord = useFormInput('');
    const role = useFormInput('');
    const city = useFormInput('');
    const state= useFormInput('');
    const [error,setError] = useState(false);
    const [errors,setErrors] = useState(undefined);
    const [redirectToHome,setRedirectToHome] = useState(false);
    let errorArea;
    const handleRegister= async ()=>{
        let inputErrors = [];
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email.value||!emailRegex.test(email.value)) inputErrors.push('invalid email');
        if(!password.value) inputErrors.push('Need password');
        if(!firstName.value) inputErrors.push('Need First Name');
        if(!lastName.value) inputErrors.push('Need Last name');
        if(!confirmedPasseord.value) inputErrors.push('Need confirmed password');
        if(confirmedPasseord.value !== password.value) inputErrors.push('password and confirmed password do not match');
        if(!role.value) inputErrors.push('Need to declare your role of student/teacher');
        if(!city.value) inputErrors.push('Need city');
        if(!state.value) inputErrors.push('Need state');
        if(inputErrors.length>0){
            setError(true);
            setErrors(inputErrors);
        }else{
            let isteacher = role.value=='teacher'?true:false
            try{
                let apiResponse = await axios.post('/users',{firstName:firstName.value,lastName:lastName.value,email:email.value,password:password.value,password_confirm:confirmedPasseord.value,isteacher:isteacher,city:city.value,state:state.value});
                //console.log(apiResponse);
                if(!apiResponse.data.error){
                    let loggedInUser = {
                        firstName: apiResponse.data.data.firstName,
                        lastName:apiResponse.data.data.lastName,
                        userId:apiResponse.data.data._id
                    }
                    authContext.setAuthState({
                        logged:true,
                        user:loggedInUser
                    })
                    setRedirectToHome(true);
                }else{
                    inputErrors = apiResponse.data.errors;
                    setError(true);
                    setErrors(inputErrors);
                }
            }catch(e){
                inputErrors = e;
                setError(true);
                setErrors(inputErrors);
            }
        }
    }
    const buildError = (e)=>{
        return(
            <li>{e}</li>
        )
    }
    errorArea = error&&errors&&errors.map((e)=>{
        return buildError(e);
    })

    if(redirectToHome){
        return (
            <Redirect to='/'/>
        )
    }else if(error&&errors){
        return(
            <div>
            <div className='register-card' key='register'>
                <div className='card-body'>
                    <h2 className='card-title'>
                        Register
                    </h2>
                    <div>
                        <label>First Name</label><br/>
                        <input type = 'text' {...firstName} name='first_name' placeholder='First Name'/><br/>
                        <label>Last Name</label><br/>
                        <input type = 'text' {...lastName} name='last_name' placeholder='Last Name'/><br/>
                        <label>Email</label><br/>
                        <input type = 'text' {...email} name='email' placeholder='Email'/><br/>
                        <label>Password</label><br/>
                        <input type = 'password' {...password} name='password' placeholder='Password'/><br/>
                        <label>Confirmed Password</label><br/>
                        <input type = 'password' {...confirmedPasseord} name='confirmed_password' placeholder='Confirmed Password'/><br/>
                        <lable>I am a </lable>
                        <select name='role' {...role} id='role'>
                        <option value='student' defaultValue="selected">student</option>
                        <option value='teacher'>teacher</option>
                        </select><br/>
                        <label>City</label><br/>
                        <input type = 'text' {...city} name='city' placeholder='City'/><br/>
                        <label>State</label><br/>
                        <select name = 'state' {...state} id='state'>
                        <option value="" defaultValue="selected">Select a State</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                        </select>
                        <br/>
                        <br/>
                        <ui>
                            {errorArea}
                        </ui>
                        <input type = 'button' className = 'submit-button' value = 'submit' onClick={handleRegister}/>
                    </div>
                </div>
            </div>
        </div>
        )

    }else{
        return (
            <div>
                <div className='register-card' key='register'>
                    <div className='card-body'>
                        <h2 className='card-title'>
                            Register
                        </h2>
                        <div>
                            <label>First Name</label><br/>
                            <input type = 'text' {...firstName} name='first_name' placeholder='First Name'/><br/>
                            <label>Last Name</label><br/>
                            <input type = 'text' {...lastName} name='last_name' placeholder='Last Name'/><br/>
                            <label>Email</label><br/>
                            <input type = 'text' {...email} name='email' placeholder='Email'/><br/>
                            <label>Password</label><br/>
                            <input type = 'password' {...password} name='password' placeholder='Password'/><br/>
                            <label>Confirmed Password</label><br/>
                            <input type = 'password' {...confirmedPasseord} name='confirmed_password' placeholder='Confirmed Password'/><br/>
                            <lable>I am a </lable>
                            <select name='role' {...role} id='role'>
                            <option value='student' defaultValue="selected">student</option>
                            <option value='teacher'>teacher</option>
                            </select><br/>
                            <label>City</label><br/>
                            <input type = 'text' {...city} name='city' placeholder='City'/><br/>
                            <label>State</label><br/>
                            <select name = 'state' {...state} id='state'>
                            <option value="" defaultValue="selected">Select a State</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                            </select>
                            <br/>
                            <br/>
                            <input type = 'button' className = 'submit-button' value = 'submit' onClick={handleRegister}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


};

export default Register;
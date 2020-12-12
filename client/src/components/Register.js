import React, { useState } from 'react';
import './App.css'; 
import axios from 'axios';
import { Redirect } from 'react-router-dom';

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
    const firstName = useFormInput('');
    const lastName = useFormInput('');
    const email = useFormInput('');
    const password = useFormInput('');
    const confirmedPasseord = useFormInput('');
    const city = useFormInput('');
    const state= useFormInput('');
    const [error,setError] = useState(false);
    const [redirectToHome,setRedirectToHome] = useState(false);

    const handleRegister= async ()=>{
        //do the input validation?
        //let apiResponse = await axios.get('http://localhost:4000/classes/5fcbd558cca0331d0a3a3685');
        try{
            let apiResponse = await axios.post('/users',{firstName:firstName.value,lastName:lastName.value,email:email.value,password:password.value,password_confirm:confirmedPasseord.value,city:city.value,state:state.value});
            if(!apiResponse.data.error){
                setRedirectToHome(true);
            }
        }catch(e){
            console.log(e);
        }



    }

    if(redirectToHome){
        return (
            <Redirect to='/'/>
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
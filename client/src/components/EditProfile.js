import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from './context/AuthContext';
import './App.css';
import axios from 'axios';

const EditProfile = () => {
    const [auth, setAuth] = useState(false);
    const [authUser, setAuthUser] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [uploadImage, setUploadImage] = useState(undefined)
    const [firstName, setFirstName] = useState(undefined)
    const [lastName, setLastName] = useState(undefined)
    const [city, setCity] = useState(undefined)
    const [state, setState] = useState(undefined)

    useEffect(() => {
        async function getUser() {
            try {
                const theUser = await axios.get('/users/profile');
                setAuth(true)
                setAuthUser(theUser.data.data);

            } catch (e) {
                setAuth(false);
                console.log(e);
            }
            setLoading(false);
        }
        getUser()

    }, [])

    const imageHandle = async (e) => {
        e.preventDefault();
        await setUploadImage(e.target.files[0]);
        alert("image upload success")
    }

    const firstNameChange = (e) => {
        e.preventDefault();
        setFirstName(e.target.value)
    }
    const lastNameChange = (e) => {
        e.preventDefault();
        setLastName(e.target.value)
    }
    const cityChange = (e) => {
        e.preventDefault();
        setCity(e.target.value)
    }
    const stateChange = (e) => {
        e.preventDefault();
        setState(e.target.value)
    }


    const handleSubmit = (e) => {
        let userUpdatedata = authUser;
        //handle image upload or update base on if user already have a picture
        if(uploadImage){
            let formdata = new FormData();
            formdata.append("file",uploadImage)
            formdata.append("id",userUpdatedata._id)
            formdata.append("type","user")
            if(userUpdatedata.hasPicture===false){
                userUpdatedata.hasPicture = true
                axios.post("/image/upload",formdata)
            }else {
                axios.post("/image/update",formdata)
            }
        }

        if(firstName){
            userUpdatedata.firstName = firstName;
        }
        if(lastName){
            userUpdatedata.lastName = lastName;
        }
        if(city){
            userUpdatedata.city = city;
        }
        if(state){
            userUpdatedata.state = state;
        }
        axios.post("/users/update", userUpdatedata)

    }

    const imageRender = (hasPicture) => {
        if(hasPicture){
            return <img src={'/image/get?id='+authUser._id+'&type=user'}/>
        }else {
            return <img src={'https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-600w-418179865.jpg'}/>
        }
    }

    if (loading) {
        return (
            <p>Loading</p>
        )
    } else if (auth && authUser) {
        return (
            <div className='edit-profile-card'>
                {imageRender(authUser.hasPicture)}
                <label></label><br/>
                <input type='file' name='file' placeholder='User Image'
                        onChange={imageHandle}/><br/>
                <label>First Name</label><br/>
                <input type='text' name='first_name' placeholder='First Name' value={authUser.firstName}
                       onChange={firstNameChange}/><br/>
                <label>Last Name</label><br/>
                <input type='text' name='last_name' placeholder='Last Name' value={authUser.lastName}
                       onChange={lastNameChange}/><br/>
                <label>City</label><br/>
                <input type='text' name='city' placeholder='City' value={authUser.city} onChange={cityChange}/><br/>
                <label>State</label><br/>
                <select name='state' id='state' value={authUser.state} onChange={cityChange}>
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
                <input type='button' className='submit-button' value='submit' onClick={handleSubmit}/>
                <br/>
            </div>

        )
    } else {
        return (
            <Redirect to='/login'/>
        )
    }


}

export default EditProfile;
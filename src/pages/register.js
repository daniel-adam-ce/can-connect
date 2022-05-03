import React from 'react'
import {useContext, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App';
import '../styles/auth.css'

import Paper from '@mui/material/Paper';
import TextField  from '@mui/material/TextField'


const RegisterPage = () => {
    const [authState, setAuthState] = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [emailConfirm, setEmailConfirm] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [passwordError, setPasswordError] = useState({state: false, message: ''})
    const [emailError, setEmailError] = useState({state: false, message: ''})
    const navigate = useNavigate()
    const url = 'https://can-connect-server.herokuapp.com'
    // const url = 'http://localhost:5000'
    const submit = async (event) => {
        event.preventDefault()
        try {
            const user = {
                email: email,
                emailConfirm: emailConfirm,
                password: password,
                passwordConfirm: passwordConfirm,
            }
            setEmailError({state:false, message: ''})
            setPasswordError({state:false, message: ''})
            const res = await axios.post(`${url}/user/auth/register`, user)
            // const res = await axios.post(`${url}/user/auth/register`, user)
            console.log(res)
            navigate('/auth')
        } catch (error) {
            if (error.response.data.message.errors) {
                for (let i in error.response.data.message.errors) {
                    console.log(error.response.data.message.errors[i])
                    if (error.response.data.message.errors[i].type === 'email') {
                        setEmailError({state: true, message: error.response.data.message.errors[i].message})
                    }
                    if (error.response.data.message.errors[i].type === 'password') {
                        setPasswordError({state: true, message: error.response.data.message.errors[i].message})
                    }
                }
            }
            console.log(error)
        }
    }

    return (
        <div className='auth-body'>
            <Paper className='paper-auth-bg' key={1} elevation={12}>
                <div className="login-text">{"Sign Up"}</div>
                <div className="auth-text-field">
                    <TextField value={email} onChange={(event)=>{
                        setEmail(event.target.value)
                    }} error={emailError.state} helperText={emailError.state && emailError.message}  fullWidth label="Email"></TextField>
                </div>
                <div className="auth-text-field">
                    <TextField value={emailConfirm} onChange={(event)=>{
                        setEmailConfirm(event.target.value)
                    }} error={emailError.state} helperText={emailError.state && emailError.message} fullWidth label="Confirm Email"></TextField>
                </div>
                <div className="auth-text-field">
                    <TextField value={password} onChange={(event)=>{
                        setPassword(event.target.value)
                    }} error={passwordError.state} helperText={passwordError.state && passwordError.message} type="password" fullWidth label="Password"></TextField>
                </div>
                <div className="auth-text-field">
                    <TextField value={passwordConfirm} onChange={(event)=>{
                        setPasswordConfirm(event.target.value)
                    }} error={passwordError.state} helperText={passwordError.state && passwordError.message} type="password"fullWidth label="Confirm Password"></TextField>
                </div>
                <div >
                    <button className="login-button" onClick={(event)=>{
                        submit(event)
                    }}>
                        {"Sign Up"}
                    </button>
                </div>
            </Paper>
        </div>

        
    )
}

export default RegisterPage
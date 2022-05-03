import React from 'react';
import {useEffect, useContext, useState} from 'react';
import { AuthContext } from '../App';
import axios from 'axios';
import { useNavigate, } from 'react-router-dom';
import '../styles/dashboard.css';
import Spinner from '../components/spinner';

import Paper from '@mui/material/Paper';
const DashboardPage = () => {
    const [authState, setAuthState] = useContext(AuthContext)
    const [loadState, setLoadState] = useState(false)
    const navigate = useNavigate()
    const url = 'https://can-connect-server.herokuapp.com'
    useEffect(()=>{ 
        setLoadState(true)
        const user = JSON.parse(localStorage.getItem('user'))
        const source = axios.CancelToken.source()
        if (user === null) {
            console.log('user is null')
            setAuthState(false)
            navigate('/auth')
        } else {
            console.log(user.token)
            axios.post(`${url}/user/auth`, {}, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }).then((res)=>{
                console.log(res.data)
                setAuthState(true)
                setLoadState(false)
            }).catch((res)=>{
                console.log(res.response)
                setAuthState(false)
                navigate('/auth')
            })
        }
        return () => {
            source.cancel()
        }

    }, [navigate, setAuthState])

    return (
        !loadState ? <div style={{marginTop: '5rem', backgroundColor:'#eeeeee'}}>
            <Paper className='paper-dashboard-bg' elevation={8}>
                <div className='dashboard-button-container'>
                    <button className='dashboard-button' onClick={()=>{
                        navigate('/raw-can?p=1&device=All Devices&vehicle=All Vehicles')
                    }}>
                    Raw CAN Data
                    </button>
                </div>
                <div className='dashboard-button-container'>
                    <button className='dashboard-button' onClick={()=>{
                        navigate('/vehicle-data')
                    }}>
                    Vehicle Codes
                    </button>
                </div>
                <div className='dashboard-button-container'>
                    <button className='dashboard-button' onClick={()=>{
                        navigate('/trouble-codes')
                    }}>
                    Trouble Codes
                    </button>
                </div>
                <div className='dashboard-button-container'>
                    <button className='dashboard-button' onClick={()=>{
                        navigate('/configure')
                    }}>
                    Configure Vehicles and Devices
                    </button>
                </div>
            </Paper> 
                    
        </div> : <Spinner size="small" backgroundColor="#eeeeee"></Spinner>
    )
}

export default DashboardPage


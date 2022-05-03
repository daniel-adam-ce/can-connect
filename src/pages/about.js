import React from 'react'
import Paper from '@mui/material/Paper';
import '../styles/about.css'
import { useNavigate } from 'react-router-dom'
import Fader from '../components/fader.js'

const AboutPage = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    return (
        <div className='about-body'>
            <Paper className='paper-bg' key={1} elevation={24}>
                <Fader>
                    <h1>something awesome about</h1>
                    <div>can connect</div>
                    <div>
                    <button className="google-button" onClick={()=>{
                        if (user !== undefined) {
                            navigate('/dashboard')
                        } else {
                            navigate('/auth')
                        }
                    }}>
                            Get Started with Google
                        </button>
                    </div>
                </Fader>
            </Paper>
        </div>
    )
}

export default AboutPage
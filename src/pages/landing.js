import React from 'react'
import { useNavigate, } from 'react-router-dom'
import landingImg from "../images/landing1.png"
import Fader from '../components/fader'
import '../styles/landing.css'

const LandingPage = () => {
    
    const navigate = useNavigate()

    return (
            <div style={{backgroundColor:"#212529"}}>
                <figure className="landing-image">
                    <img src={landingImg} alt="phone" width="100%"></img>
                </figure>
                <div>
                <Fader>
                    <figcaption className={`figcaption-1 content-body`}>
                        {"CAN Connect."}
                    </figcaption>
                </Fader>

                <Fader sleep={1000}>
                    <figcaption className={`figcaption-2 content-body`}>
                        {"Access your car's data any time, any place."}
                    </figcaption>
                </Fader>

                <Fader sleep={1500}>
                    <figcaption className={`figcaption-3 content-body`}>
                        <button className="start-button" onClick={()=>{
                                navigate('/about')
                        }}>
                            Learn How It Works
                        </button>
                    </figcaption> 
                </Fader>
                  
                </div>
            </div>
    )   
}

export default LandingPage
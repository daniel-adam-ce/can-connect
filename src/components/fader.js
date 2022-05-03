import React from "react"
import {useState, useEffect} from 'react'



const Fader = (props) => {

    const styleFadeIn = {
        transition: `opacity ${(props.fadeInTime === undefined ? 1000 : props.fadeInTime)/1000}s linear`
    }
    
    const styleFadeOut = {
        opacity: 0
    }

    const [fadeStyleState, setFadeStyleState] = useState(styleFadeOut)
    useEffect(()=>{
        const timeout = setInterval(()=>{
            setFadeStyleState(styleFadeIn)
        }, props.sleep === undefined ? 0 : props.sleep)
        return () => {
            clearTimeout(timeout)
        }
    }, [])


    return (
        <div style={fadeStyleState}>{props.children}</div>
    )
}

export default Fader


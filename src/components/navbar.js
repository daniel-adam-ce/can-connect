import React from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"
import { NavLink } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../App';
import { useGoogleLogout } from "react-google-login"

const NavBar = () => {
    const [authState, setAuthState] = useContext(AuthContext)
    const user = JSON.parse(localStorage.getItem('user'))
    const logout = () => {
        localStorage.removeItem('user'); 
        setAuthState(false)
    }

    const {signOut, loaded} = useGoogleLogout({
        clientId: "469403570539-fnk4vhg7v5eb9ta1no0lr5fc24gco4b8.apps.googleusercontent.com",
        onLogoutSuccess: logout
    })

    return (
        <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
        <Navbar.Brand as={NavLink} to="/">CAN Connect</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={NavLink} to="/raw-can?p=1&device=All Devices&vehicle=All Vehicles">CAN Data</Nav.Link>
                <Nav.Link as={NavLink} to="/trouble-codes">Trouble Codes</Nav.Link>
                <Nav.Link as={NavLink} to="/vehicle-data">Vehicle Data</Nav.Link>
                <Nav.Link as={NavLink} to="/configure">Configure</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link onClick={()=>{
                    if (authState) {
                        if (user.isGoogle) {
                            signOut()
                        } else {
                            logout()
                        }
                    }
                }} as={NavLink} to="/auth">{authState ? "Logout" : "Login"}</Nav.Link>
                {authState && user.isGoogle && <Navbar.Brand>
                <img
                    src={user.profileObj.imageUrl}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="profile"
                    style={{borderRadius: '10rem'}}
                />
                </Navbar.Brand>}
            </Nav>
        </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}

export default NavBar

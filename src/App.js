import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing.js'
import AuthPage from './pages/auth.js'
import RawPage from './pages/raw.js'
import TroublePage from './pages/trouble.js'
import VehiclePage from './pages/vehicle.js'
import ConfigPage from './pages/config.js'
import NotFoundPage from './pages/notFound.js'
import NavBar from './components/navbar'
import AboutPage from './pages/about.js'
import DashboardPage from './pages/dashboard.js'
import NotFoundRedirect from './components/notFoundRedirect.js'
import RegisterPage from './pages/register'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useState, useEffect } from 'react'

export const AuthContext = React.createContext()

const url = 'https://can-connect-server.herokuapp.com'
// const url = 'http://localhost:5000'

function useTokenVerify() {
  const [authState, setAuthState] = useState(false)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'))
    const source = axios.CancelToken.source()
    if (user === null) {
        console.log('user is null')
    } else {
        axios.post(`${url}/user/auth`, {}, {
          headers: {
              'Authorization': `Bearer ${user.token}`
          }
      }).then((res)=>{
            // console.log(res.data)
            setAuthState(true)
        }).catch((res)=>{
            console.log(res.response)
        })
    }
    return () => {
        source.cancel()
    }
  }, [])
  return [authState, setAuthState]
}

function App() {
  
  const [authState, setAuthState] = useTokenVerify()
  
  return (
    <div>
      
      <Router>
      <AuthContext.Provider value={[authState, setAuthState]}>
      <NavBar/>
          <Routes>
            <Route path='/' exact element={<LandingPage/>}></Route>
            <Route path='/about' element={<AboutPage/>}></Route>
            <Route path='dashboard' element={<DashboardPage/>}></Route>
            <Route path='/auth' element={<AuthPage/>}></Route>
            <Route path='/auth/register' element={<RegisterPage/>}></Route>
            <Route path='/raw-can' element={<RawPage/>}></Route>
            <Route path='/trouble-codes' element={<TroublePage/>}></Route>
            <Route path='/vehicle-data' element={<VehiclePage/>}></Route>
            <Route path='/configure' element={<ConfigPage/>}></Route>
            <Route path='/not-found' element={<NotFoundPage/>}></Route>
            <Route path='*' element={<NotFoundRedirect/>}></Route>
          </Routes>
        </AuthContext.Provider>
      </Router> 
      
      
    </div>
  );
}

export default App;

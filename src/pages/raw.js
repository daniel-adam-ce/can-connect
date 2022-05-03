import React from 'react'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../App';
import axios from 'axios'
import {useNavigate, useSearchParams } from 'react-router-dom'
import "../styles/raw.css"

// import Spinner from 'react-bootstrap/Spinner'

import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import Spinner from '../components/spinner.js';


const RawPage = () => {
    const [authState, setAuthState] = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [table, setTable] = useState([])
    const [pages, setPages] = useState(1)
    const [pageSelected, setPageSelected] = useState(parseInt(searchParams.get('p')))
    const [loadState, setLoadState] = useState(false)
    const [numDisplayHex, setNumDisplayHex] = useState(true)
    const navigate = useNavigate()
    const numPerPage = window.innerWidth >= 650 ? 10 : 5;
    const [deviceSerialSelected, setDeviceSerialSelected] = useState(searchParams.get('device') === 'All Devices' ? '' : searchParams.get('device') )
    const [vehicleNameSelected, setVehicleNameSelected] = useState(searchParams.get('vehicle') === 'All Vehicles' ? '' : searchParams.get('vehicle'))
    const [deviceArray, setDeviceArray] = useState([])
    const [vehicleArray, setVehicleArray] = useState([])
    const [sortStates, setSortStates] = useState({
        dateReceived: -1, 
        arbId: 0,
    })
    const [sort, setSort] = useState([-1, 'dateReceived'])
    const url = 'https://can-connect-server.herokuapp.com'
    // const url = 'http://localhost:5000'

    const displaySortSymbol = (state) => {
        if (state === 1) {
            return '\u25bc'
        }
        if (state === -1) {
            return '\u25b2'
        }
        return '-'
    }

    const displayTable = () => {

        const formatDate = (date) => {
            const d = new Date(date)
            return (("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2))
        }
        return table.map((item) => {
            return (
                <tr key={item._id}>
                <td>{formatDate(item.dateReceived)}</td>
                <td>{numDisplayHex ? item.arbId.toString(16) : item.arbId}</td>
                <td>{numDisplayHex ? item.payload.toString(16) : item.payload}</td>
                <td>{item.deviceSerial}</td>
                <td>{item.vehicleName}</td>
                </tr>
            )
        })
    }

    const displayVehicleOptions = () => {
        let ids = vehicleArray
        return ids.map((item)=>(
            <MenuItem key={item} value={item}>{item}</MenuItem>
        ))
    }

    const displayDeviceOptions = () => {
        let ids = deviceArray
        return ids.map((item)=>(
            <MenuItem key={item} value={item}>{item}</MenuItem>
        ))
    }

    
    useEffect(()=>{
        if (pageSelected !== searchParams.get('p')-1 ) {
            setPageSelected(parseInt(searchParams.get('p')))
        }
        setVehicleNameSelected(searchParams.get('vehicle') === 'All Vehicles' ? '' : searchParams.get('vehicle'))
        setDeviceSerialSelected(searchParams.get('device') === 'All Devices' ? '' : searchParams.get('device'))
        const user = JSON.parse(localStorage.getItem('user'))
        const source = axios.CancelToken.source()
        if (user === null) {
            console.log('user is null')
            navigate('/auth')
        } else {
            const retrieveData = async () => {
        
                const user = JSON.parse(localStorage.getItem('user'))
                try {
                    
                    setLoadState(true)
                    let res = await axios.get(`${url}/can/?num=${numPerPage}&sort[]=${sort[0]}&sort[]=${sort[1]}&vehicleName=${vehicleNameSelected}&deviceSerial=${deviceSerialSelected}&skip=${numPerPage*(pageSelected-1)}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    console.log(res)
                    setTable(res.data)
                    
                    res = await axios.get(`${url}/can/count?deviceSerial=${deviceSerialSelected}&vehicleName=${vehicleNameSelected}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    console.log(res.data)
                    setPages(Math.ceil(res.data/numPerPage))
                    res = await axios.get(`${url}/user/vehicles-devices`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    console.log(res.data)
                    setVehicleArray(res.data[0])
                    setDeviceArray(res.data[1])
                    
                    setLoadState(false)
                } catch (error) {
                    if (error.response.status === 401) {
                        navigate('/auth')
                        setAuthState(false)
                    }
                    if (error.response.status === 400) {
                        alert(error.response.data.message)
                    }
                    console.log(error.response)
                }
            }
            retrieveData()
        }
        return () => {
            source.cancel()
        }
    }, [vehicleNameSelected, deviceSerialSelected, pageSelected, navigate, searchParams, sort, setAuthState, numPerPage])

    return (
        <div className="raw-body">

            <div style={{margin: '0 auto', width: '50%', textAlign:'center'}}>
                <div >
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="device-dropdown-label">Device</InputLabel>
                    <Select
                        className="dropdown"
                        labelId="device-dropdown-label"
                        id="device-dropdown"
                        value={deviceSerialSelected}
                        label="Device"
                        onChange={(event)=>{
                            setDeviceSerialSelected(event.target.value === "All Devices" ? '' : event.target.value)
                            navigate(`/raw-can?p=${1}&device=${event.target.value}&vehicle=${vehicleNameSelected}`)
                        }}
                    >
                        <MenuItem value={'All Devices'}>All Devices</MenuItem>
                        {displayDeviceOptions()}
                    </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="vehicle-dropdown-label">Vehicle Name</InputLabel>
                    <Select
                        className="dropdown"
                        labelId="vehicle-dropdown-label"
                        id="vehicle-dropdown"
                        value={vehicleNameSelected}
                        label="Vehicle Name"
                        onChange={(event)=>{
                            setVehicleNameSelected(event.target.value === "All Vehicles" ? '' : event.target.value)
                            navigate(`/raw-can?p=${1}&device=${deviceSerialSelected}&vehicle=${event.target.value}`)
                        }}
                    >
                        <MenuItem value={'All Vehicles'}>All Vehicles</MenuItem>
                        {displayVehicleOptions()}
                    </Select>
                    </FormControl>
                    
                </div>
            </div>

            {!loadState ? 
                <Container className="table-container" fixed>
                    <Paper elevation={8}>
                        <table className='raw-can-table' style={{fontSize: '2vmin'}}>
                            <tbody>
                                <tr>
                                    <th>Date Received <button className='sort-button'onClick={()=>{
                                        setSort([sort[0] === -1 ? 1 : -1, 'dateReceived'])
                                    }}>{sort[1] === 'dateReceived' ? displaySortSymbol(sort[0]) : '-'}</button></th>
                                    <th >Arbitration ID<button className='sort-button'onClick={()=>{
                                        setSort([sort[0] === -1 ? 1 : -1, 'arbId'])
                                    }}>{sort[1] === 'arbId' ? displaySortSymbol(sort[0]) : '-'}</button></th>
                                    <th>Payload Data</th>
                                    <th>Device Serial #</th>
                                    <th>Vehicle Name</th>
                                </tr>
                                {displayTable()}
                            </tbody>
                            
                        </table>
                    </Paper>

                </Container>
            : <Spinner size="small" backgroundColor="#eeeeee"/>}
            
            <Stack spacing={2}>
                <Pagination color="primary" className='pagination' count={pages} page={pageSelected} onChange={(event, value) => {
                        setPageSelected(value)
                        let v  =  vehicleNameSelected === '' ? 'All Vehicles' : vehicleNameSelected
                        let d  =  deviceSerialSelected === '' ? 'All Devices' : deviceSerialSelected
                        navigate(`/raw-can?p=${value}&device=${d}&vehicle=${v}`)
                    }}></Pagination>
            </Stack>
        </div>
        
    )
}

export default RawPage
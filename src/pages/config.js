import React from 'react'
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import axios from 'axios'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../App';
import { useNavigate, } from 'react-router-dom'
import { Container } from '@mui/material';

import '../styles/config.css'
import Spinner from '../components/spinner';
const ConfigPage = () => {

    const [tables, setTable] = useState({devices: [], vehicles: []});
    const [newItem, setNewItem] = useState('');
    const [itemType, setItemType] = useState('vehicles');
    const [loadState, setLoadState] = useState(true);
    const [authState, setAuthState] = useContext(AuthContext)
    const url = 'https://can-connect-server.herokuapp.com'
    // const url = 'http://localhost:5000'

    const navigate = useNavigate()
    const displayTable = (key) => {
        return tables[key].map((item, index)=> {
            return (
                <tr key={item}>
                    <td>{index+1}</td>
                    <td>{item} </td>
                    <td style={{textAlign:'right'}}><button className='row-button remove-button' disabled={loadState} onClick={()=>{
                        removeItem(item)
                    }}>-</button></td>
                </tr>
            )
        })
    }

    const addNewItem = async () => {
        try {
            setLoadState(true)
            const user = JSON.parse(localStorage.getItem('user'));
            if (newItem === '') {
                throw new Error('Name is required');
            }
            const data = itemType === 'vehicles' ? {vehicleName: newItem} : {deviceSerial: newItem};
            const res = await axios.patch(`${url}/user/add`, data, {
                headers: {
                    'Authorization' : `Bearer ${user.token}`
                }
            });
            console.log(res);
            setTable({vehicles: res.data[0], devices: res.data[1]});
            setNewItem('');
            setLoadState(false);
        } catch (error) {
            if (error.response.status === 401) {
                setAuthState(false);
                navigate('/auth');
            }
            if (error.response.status === 400) {
                alert(error.response.data.message)
            }
            console.log(error.response);
            setLoadState(false);
        }
    }

    const removeItem = async (value) => {
        try {
            setLoadState(true)
            const user = JSON.parse(localStorage.getItem('user'));
            const data = itemType === 'vehicles' ? {vehicleName: value} : {deviceSerial: value};
            const res = await axios.patch(`${url}/user/remove`, data, {
                headers: {
                    'Authorization' : `Bearer ${user.token}`
                }
            });
            console.log(res);
            setTable({vehicles: res.data[0], devices: res.data[1]});
            setLoadState(false);
        } catch (error) {
            if (error.response.status === 401) {
                setAuthState(false);
                navigate('/auth');
            }
            if (error.response.status === 400) {
                alert(error.response.data.message)
            }
            console.log(error.response);
            setLoadState(false);
        }
    }
    

    useEffect(()=> {
        const retrieveData = async () => {
            try {
                setLoadState(true);
                const user = JSON.parse(localStorage.getItem('user'));
                if (user === null) {
                    console.log('user is null');
                    navigate('/auth');
                } else {
                    const res = await axios.get(`${url}/user/vehicles-devices`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    console.log(res);
                    setTable({vehicles: res.data[0], devices: res.data[1]});
                }
                setLoadState(false);
            } catch (error) {
                if (error.response.status === 401) {
                    setAuthState(false);
                    navigate('/auth');
                }
                if (error.response.status === 400) {
                    alert(error.response.data.message)
                }
                console.log(error.response);
                setLoadState(false);
            }
        }
        retrieveData()
        
    }, [navigate])


    return (
        <div className="raw-body">
            {!loadState ? <div style={{margin: '0 auto', width: '50%', textAlign:'center'}}> 
            <Container fixed>
                {/* replace with native html components */}
                <FormControl>
                    
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue={'vehicles'}
                        onChange={(event)=>{
                            setItemType(event.target.value)
                        }}
                    >
                        <FormControlLabel value="vehicles" control={<Radio />} label="Vehicle" />
                        <FormControlLabel value="devices" control={<Radio />} label="Device" />
                    </RadioGroup>
                </FormControl>
                <Paper elevation={8}>
                    {!loadState && <table className='raw-can-table' style={{fontSize: 'calc(4px + 2vmin)',}}>
                        <tbody>
                            <tr style={{textAlign:"left"}}>
                                <th>#</th>
                                <th>{itemType === 'vehicles' ? 'Vehicle Name' : 'Device Serial #'}</th>
                            </tr>
                            {displayTable(itemType)}
                            <tr>
                                <td>New</td>
                                <td><input className="cfg-text-field" type='text' value={newItem} onChange={(event)=>{
                                    setNewItem(event.target.value)
                                }} style={{width:"110%"}}></input></td>
                                <td style={{textAlign:'right'}}><button className='row-button add-button' disabled={loadState} onClick={addNewItem}>+</button></td>
                            </tr>
                        </tbody>
                    </table>}
                </Paper>
            </Container>
            </div> : <Spinner size="small" backgroundColor="#eeeeee"/>}
            
            
        </div>
    )
}

export default ConfigPage
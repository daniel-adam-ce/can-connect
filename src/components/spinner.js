
import { propTypes } from 'react-bootstrap/esm/Image';
import spinnerImg from '../images/spinner.png';
import '../styles/spinner.css'

const Spinner = (props) => {
    
    const spinnerSize = props.size === 'large' ? '15%' : props.size === 'small' ? '5%' : '10%'

    return (
        <div className="spinner-container" style={{backgroundColor: props.backgroundColor}}><img className='spinner-img' src={spinnerImg} style={{width:spinnerSize}}></img></div>
    )
}

export default Spinner
import React from "react";
import { Link } from "react-router-dom";


const divStyle = {
    textAlign: 'center',
    marginTop: '15%'
}

const extraButtonStyle = {
    marginTop: '18px'
}

const inputStyle = { 
    fontSize: '18px',
    borderRadius: '15px'
}




export function EnterName() {
    return(
        <div style={divStyle}>
            <label htmlFor="name"><h2>Your Name</h2></label>
            <input type="text" id="name" required style={inputStyle}></input><br />
            <Link to='/game'>
                <button className='button-style' style={extraButtonStyle}>Enter Game</button>
            </Link>
           
        </div>
    )
}
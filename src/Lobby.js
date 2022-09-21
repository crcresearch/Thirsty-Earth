import React from "react";
import { Link } from "react-router-dom";

const divStyle = {
    textAlign: 'center',
    marginTop: '5%'
}

const extraButtonStyle = {
    marginTop: '18px'
}

const inputStyle = { 
    fontSize: '18px',
    borderRadius: '15px',
    marginBottom: '18px'
}

export function EnterName() {
    return(
        <div style={divStyle}>
            <h2>Enter Game</h2>
            <label htmlFor="roomid">Room ID: </label>
            <input type="text" id="roomid" required style={inputStyle}></input><br />
            <label htmlFor="name">Your name: </label>
            <input type="text" id="name" required style={inputStyle}></input><br />
            <Link to='/game'>
                <button className='button-style' style={extraButtonStyle}>Join</button>
            </Link>

            <h2>Create Game</h2>
            <label htmlFor="name">Your name: </label>
            <input type="text" id="name" required style={inputStyle}></input><br />
            <Link to='/game'>
                <button className='button-style' style={extraButtonStyle}>Create</button>
            </Link>  
        </div>
    )
}
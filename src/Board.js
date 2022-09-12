import React from 'react';

export function ButtonBoard({ ctx, G, moves }) {

    const onClick = () => {
        moves.clickButton();
    };

    const buttonStyle = {
        backgroundColor: '#0033ff',
        color: '#ffffff',
        borderRadius: '15px',
        border: '5px solid black',
        fontSize: '18pt'
    };

    const divStyle = {
        textAlign: 'center'
    }

    return (
        <div style={divStyle}>    
            <h1>Current player: {ctx.currentPlayer}</h1>
            <h1>Button value: {G.buttonValue}</h1> 
            <button style={buttonStyle} onClick={() => onClick()}> push me.</button> 
        </div>
    )
}
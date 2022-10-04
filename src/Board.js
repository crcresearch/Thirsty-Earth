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

    const chatStyle = {
        backgroundColor: 'red',
        height: '100vh'
    }

    const gameBoardStyle = {
        backgroundColor: 'blue',
        height: '100vh'
    }

    const recordsStyle = {
        backgroundColor: 'green',
        height: '100vh'
    }

    // return (
    //     <div style={divStyle}>    
    //         <h1>Current player: {ctx.currentPlayer}</h1>
    //         <h1>Button value: {G.buttonValue}</h1> 
    //         <button style={buttonStyle} onClick={() => onClick()}> push me.</button> 
    //     </div>
    // )
    return (
        <div className="container">
            <div className="row">
                <h1>Year: 1</h1>
                <h1>Village: Test</h1>
            </div>
            <div className="row">
                <div className="col" style={chatStyle}>
                    placeholder
                </div>
                <div className="col-6" style={gameBoardStyle}>
                    placeholder
                </div>
                <div className="col" style={recordsStyle}>
                    placeholder
                </div>
            </div>
        </div>
    )
}
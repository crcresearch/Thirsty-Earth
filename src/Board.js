import React from 'react';
import { ChatBox } from './components/ChatBox';
import { PreviousRounds } from './components/PreviousRounds';
import { MainField } from './components/MainField';

export function ButtonBoard({ ctx, G, moves }) {

    const onClick = () => {
        moves.clickButton();
    };


    // return (
    //     <div style={divStyle}>    
    //         <h1>Current player: {ctx.currentPlayer}</h1>
    //         <h1>Button value: {G.buttonValue}</h1> 
    //         <button style={buttonStyle} onClick={() => onClick()}> push me.</button> 
    //     </div>
    // )
    return (
        <div className="container">
            <div className="row title-font">
                <h1>Year: 1</h1>
                <h1>Village: Test</h1>
            </div>
            <div className="row">
                <div className="col">
                    <ChatBox />
                </div>
                <div className="col-6">
                    <MainField />
                </div>
                <div className="col">
                    <PreviousRounds />
                </div>
            </div>
        </div>
    )
}
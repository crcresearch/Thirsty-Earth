import React from 'react';
import { ChatBox } from './components/ChatBox';
import { PreviousRounds } from './components/PreviousRounds';

export function ButtonBoard({ ctx, G, moves }) {

    const onClick = () => {
        moves.clickButton();
    };

    const gameBoardStyle = {
        backgroundColor: 'blue',
        height: '100vh'
    }

    const selectionsStyle = {
        backgroundColor: 'grey',
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
                <div className="col">
                    <ChatBox />
                </div>
                <div className="col-6" style={gameBoardStyle}>
                    <div className="container">
                        <div className="row">
                            <div className="col" style={selectionsStyle}>
                                placeholder
                            </div>
                            <div className="col-10">
                                placeholder
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <PreviousRounds />
                </div>
            </div>
        </div>
    )
}
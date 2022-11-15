import React from 'react';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { ChatBox } from './components/ChatBox';
import { PreviousRounds } from './components/PreviousRounds';
import { MainField } from './components/MainField';
import { ResultsModal } from './components/ResultsModal'

import { playerIDAtom } from './atoms/pid';

export function ButtonBoard({ ctx, G, moves, sendChatMessage, chatMessages }) {

    const playerID = useRecoilValue(playerIDAtom);
    const [showModal, setShowModal] = useState(false);

    //Show the results modal if the game is over.
    useEffect(() => {
        if(ctx.gameover === true) {
            setShowModal(true);
        }
    }, [ctx.gameover, showModal])
    return (
        <div>
            <ResultsModal showModal={showModal} playerStats={G.playerStats} />
            <div className="container">
                <div className="row title-font">
                    <h1>Year: {G.currentRound}</h1>
                    <h1>Village: Test</h1>
                    <h1>Your Money: {G.playerStats[playerID].playerMoney.toFixed(2)}</h1>
                </div>
                <div className="row">
                    <div className="col">
                        {/*pass down chat functions and objects as props so that the chatbox has access to them.*/}
                        <ChatBox sendMessageFn={sendChatMessage} chatMessages={chatMessages}/>
                    </div>
                    <div className="col-6">
                        <MainField moves={moves}/>
                    </div>
                    <div className="col">
                        <PreviousRounds />
                    </div>
                </div>
            </div>
        </div>
      
    )
}
import React from 'react';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { ChatBox } from './components/ChatBox';
import { PreviousRounds } from './components/PreviousRounds';
import { MainField } from './components/MainField';
import { ResultsModal } from './components/ResultsModal'
import { Moderator } from './components/Moderator'

import { playerIDAtom } from './atoms/pid';

export function ButtonBoard({ ctx, G, moves, sendChatMessage, chatMessages, matchData }) {

    const playerID = useRecoilValue(playerIDAtom);
    const [showModal, setShowModal] = useState(false);
    const [moderated, setModerated] = useState(false);

    //Show the results modal if the game is over.
    useEffect(() => {
        if(ctx.gameover === true) {
            setShowModal(true);
        }
    }, [ctx.gameover, showModal])

    useEffect(() => {
        if(G.gameConfig.moderated === true) {
            setModerated(true);
        }
    }, [G.gameConfig.moderated, moderated])
    return (
        <div>

            <ResultsModal showModal={showModal} playerStats={G.playerStats} />

            {(moderated && playerID == 0) ? 
             <Moderator ctx={ctx} G={G} moves={moves} matchData={matchData}/>
             : <div className="container">
                <div className="row title-font">
                    <h1>Year: {G.currentRound}</h1>
                    <h1>Village: {G.playerStats[playerID].village}</h1>
                    <h1>Your Money: {G.playerStats[playerID].playerMoney.toFixed(2)}</h1>
                </div>
                <div className="row">
                    <div className="col">
                        {/*pass down chat functions and objects as props so that the chatbox has access to them.*/}
                        <ChatBox sendMessageFn={sendChatMessage} chatMessages={chatMessages} G={G}/>
                    </div>
                    <div className="col-6">
                    { ctx.phase == "playerMoves" ?
                        <MainField G={G} moves={moves}/>
                        :
                        <div className='d-flex align-items-center' style={{height: "100%"}}>
                            <h3>The game is currently in an instructor setup or moderation phase. The game board will appear here when players are able to make moves.</h3>
                        </div>
                    }
                    </div>
                    <div className="col">
                        <PreviousRounds G={G} playerID={playerID}/>
                    </div>
                </div>
            </div>}
        </div>
      
    )
}
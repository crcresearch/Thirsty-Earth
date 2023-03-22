import React from 'react';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { ChatBox } from './components/ChatBox';
import { PreviousRounds } from './components/PreviousRounds';
import { MainField } from './components/MainField';
import { ResultsPage } from './components/ResultsPage'
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
            {(moderated && playerID == 0) ? 
             <Moderator ctx={ctx} G={G} moves={moves} matchData={matchData}/>
            : <div className="container mt-4">
                <div className="row justify-content-md-center bg-navy text-light rounded-top">
                    <div className="col-md-6 align-self-center">
                        <h4 className="ps-1 my-2 text-center text-md-start header-font">Thirsty Earth</h4>
                    </div>
                    <div className="col-md-6 align-self-center">
                        <ul className="nav justify-content-end">
                            <li className="nav-item px-2">
                                <span class="fw-bold text-white-50">Name:</span> {matchData[playerID].name} 
                            </li>
                            <li className="nav-item px-2">
                                <span class="fw-bold text-white-50">Village:</span> {G.playerStats[playerID].village}
                            </li>
                            <li className="nav-item px-2">
                                <span class="fw-bold text-white-50">Player ID:</span> {playerID} 
                            </li>
                            {/* <li className="nav-item px-2">
                                <span class="fw-bold text-white-50">$</span>{G.playerStats[playerID].playerMoney}
                            </li> */}
                        </ul>
                    </div>
                </div>
                { ctx.gameover ?
                <ResultsPage G={G} playerID={playerID}/>
                : <div className="row">
                    {/*pass down chat functions and objects as props so that the chatbox has access to them.*/}
                    <ChatBox sendMessageFn={sendChatMessage} chatMessages={chatMessages} G={G}/>
                    { ctx.phase == "playerMoves" ?
                        <MainField G={G} moves={moves}/>
                        :
                        <div className="col-lg-7 border-navy border-start-0 border-end-0">
                            <div className='d-flex align-items-center' style={{height: "100%"}}>
                                <h3>The game is currently in an instructor setup or moderation phase. The game board will appear here when players are able to make moves.</h3>
                            </div>
                        </div>
                    }
                    <PreviousRounds G={G} playerID={playerID}/>
                </div>
                }
            </div>}
        </div>
    )
}
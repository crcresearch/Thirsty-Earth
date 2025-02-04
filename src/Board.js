import React from 'react';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { ChatBox } from './components/ChatBox';
import { PreviousRounds } from './components/PreviousRounds';
import { MainField } from './components/MainField';
import { ResultsPage } from './components/ResultsPage'
import { YearlyReview } from './components/YearlyReview';
import { Moderator } from './components/Moderator'

import { playerIDAtom } from './atoms/pid';

export function ButtonBoard({ ctx, G, moves, sendChatMessage, chatMessages, matchData }) {

    const playerID = useRecoilValue(playerIDAtom);
    const [showModal, setShowModal] = useState(false);
    const [moderated, setModerated] = useState(false);
    const [confirmedYearSummary, setconfirmedYearSummary] = useState(true);
    const confirmViewedYearlySummary = () => {
        setconfirmedYearSummary(true)
    }

    const pubInfoFormatMap = {
        'alphaF': '&alpha;<sub>F</sub>',
        'alphaR1': '&alpha;<sub>R1</sub>',
        'alphaR2': '&alpha;<sub>R2</sub>',
        'alphaS': '&alpha;<sub>S</sub>',
        'betaS1': '&beta;<sub>S1</sub>',
        'betaS2': '&beta;<sub>S2</sub>',
        'alphaG': '&alpha;<sub>G</sub>',
        'betaG': '&beta;<sub>G</sub>',
        'betaG1': '&beta;<sub>G1</sub>',
        'betaG2': '&beta;<sub>G2</sub>',
        'Unit Penalty': 'Penalty per Purchased Information (Pen)'
    }

    //Show the results modal if the game is over.
    useEffect(() => {
        if(ctx.gameover === true) {
            setShowModal(true);
        }
    }, [ctx.gameover, showModal])
    
    useEffect(() => {
        if(ctx.phase === "moderatorPause" || ctx.gameover) {
            setconfirmedYearSummary(false);
        }
        if(G.currentRound == 1) {
            setconfirmedYearSummary(true);
        }
    }, [ctx.phase])

    useEffect(() => {
        if(G.gameConfig.moderated === true) {
            setModerated(true);
        }
    }, [G.gameConfig.moderated, moderated])
    return (
        <div>
            {(moderated && playerID == 0) ? 
             <Moderator ctx={ctx} G={G} moves={moves} matchData={matchData} chatMessages={chatMessages}/>
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
                <div className="row">
                    {/*pass down chat functions and objects as props so that the chatbox has access to them.*/}
                    <ChatBox sendMessageFn={sendChatMessage} chatMessages={chatMessages} G={G} ctx={ctx}/>
                    {   ctx.phase == "moderatorPause" || !confirmedYearSummary ?
                        <YearlyReview G={G} ctx={ctx} playerID={playerID} matchData={matchData} confirmFunc={confirmViewedYearlySummary}/> 
                        : ctx.gameover ?
                        <ResultsPage G={G} playerID={playerID}/>
                        : ctx.phase == "playerMoves" ?
                        <MainField G={G} moves={moves} matchData={matchData}/>
                        : (G.playerStats[playerID].village == "unassigned" && ctx.phase == "setup") ?
                        <div className="col-lg-7 border-navy border-start-0 border-end-0">
                            <div className="d-flex align-items-end justify-content-center mb-2" style={{height: "40%"}}>
                                <h5>Awaiting Village Assignment...</h5>
                            </div>
                            <div className="d-flex align-items-start justify-content-center mt-2" style={{height: "10%"}}>
                                <h3>The game is currently in an instructor setup phase. The game board will appear here when players are able to make moves.</h3>
                            </div>
                            <div class="form-group mt-4 mx-2">
                                <label>Do you know what village you are assigned to? Select below:</label>
                                <select id={`select-${playerID}`} name="village" class="form-select" onChange={(event) => moves.setVillageAssignment(event.target.value, playerID)}>
                                    <option disabled selected>Select an option from the dropdown list</option>
                                    {G.villages.filter(el => el !== 0).map(village => (
                                        <option disabled={matchData.filter(el => G.playerStats[el.id].village === village).length == G.gameConfig.playersPerVillage} key={village} value={village}>Village {village}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        :
                        <div className="col-lg-7 border-navy border-start-0 border-end-0">
                            <div className="d-flex align-items-end justify-content-center mb-2" style={{height: "50%"}}>
                                <h5>You joined Village {G.playerStats[playerID].village}!</h5>
                            </div>
                            <div className="d-flex align-items-start justify-content-center mt-2" style={{height: "50%"}}>
                                <h3>The game is currently in an instructor setup phase. The game board will appear here when players are able to make moves.</h3>
                            </div>
                        </div>
                    }
                    <PreviousRounds G={G} playerID={playerID} matchData={matchData}/>
                </div>
                <div className="row justify-content-md-center bg-navy text-light rounded-bottom">
                    <div className="row text-white small justify-content-center text-center">
                        <div className="col-3"></div>
                        <div className="col"><span>Probability of good rain year (P): {100*G.gameConfig.probabilityWetYear}%</span></div>
                        {G.publicInfo !== null &&
                            <div className="col"><span>{pubInfoFormatMap["Unit Penalty"]}: {G.publicInfo["Unit Penalty"]}</span></div>
                        }
                        <div className="col-3"></div>
                    </div>
                    <div className="row">
                        {G.publicInfo !== null &&
                            <div className="col-md-9 align-self-center mt-2 mb-2">
                                <div className="row row-cols-5 text-white small">
                                    {Object.keys(G.publicInfo).filter(el => el !== "Unit Penalty").map((val, idx) => {
                                        return (<div className="col"><span dangerouslySetInnerHTML={{__html: pubInfoFormatMap[val]}}></span>: {G.publicInfo[val]} </div>)
                                    })}
                                </div>
                            </div>
                        }
                        <div className="col-md-3 align-self-center mt-2 mb-2">
                            For more information, <a className="text-light" target="_blank" href="https://drive.google.com/file/d/1UhCNF9zYWDqmRvvIPv5VtrsD5_XdFDk2/view?usp=sharing">click here</a>.
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
import React from 'react';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { playerIDAtom } from '../atoms/pid';
import { gameIDAtom } from '../atoms/gameid';

import axios from 'axios'
import { PLUMBER_URL } from "../config";

// left-hand side options
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';
import crop_empty from "../img/crop_empty.png";
import water_empty from "../img/water_empty.png";

// top options "toptions", if you will.
import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import apple from '../img/apple.png';

const tableStyle = {
    width: "20%"
}

const hideButton = {
    visibility: "hidden"
}

export function Moderator({ ctx, G, moves, matchData}) {
    const playerID = useRecoilValue(playerIDAtom);
    const gameID = useRecoilValue(gameIDAtom);
    const waterChoices = [cloud, river, well]
    const cropChoices = [briefcase, leaf, apple ]

    return (
        <div className='container mt-4'>
            <div className="text-center">
                <h3>Game Overview</h3>
            </div>
            <table className='table table-striped'>
                <thead>
                <td>Villages</td>
                <td>Players Per Village</td>
                <td>Players Joined</td>
                <td>Current Year</td>
                <td>Maximum Years</td>
                <td>Game ID</td>
                <td>Game Link</td>
                </thead>
                <tbody>
                    <tr>
                        <td>{G.gameConfig.numVillages}</td>
                        <td>{G.gameConfig.playersPerVillage}</td>
                        <td>{matchData.filter(player => (player.name != undefined && player.isConnected != undefined && player.isConnected == true)).length}</td>
                        <td>{G.currentRound}</td>
                        <td>{G.gameConfig.numYears}</td>
                        <td>{gameID}</td>
                        <td><a href={`/game/${gameID}`}>/game/{gameID}</a></td>
                    </tr>
                </tbody>
            </table>
            <hr/>
            <div className="text-center">
                <h3>Players</h3>
            </div>
            {(matchData.filter(el => G.playerStats[el.id].village === "unassigned").length > 0 && ctx.phase == "setup") &&
                <div>
                    <span className="h5 mt-3 mb-2">Unassigned Players</span>
                    <table className='table table-striped mb-3'>
                        <thead>
                            <td>Player ID</td>
                            <td>Player Name</td>
                            <td>Is Connected</td>
                            <td>Assign Village</td>
                        </thead>
                        <tbody>
                            {matchData.filter(el => G.playerStats[el.id].village === "unassigned").map(player => (
                                <tr key={player.id}>
                                    <td className="align-middle" style={tableStyle}>{player.id}</td>
                                    <td className="align-middle" style={tableStyle}>{player.name ? player.name : ""}</td>
                                    <td className="align-middle" style={tableStyle}>{player.isConnected ? player.isConnected.toString() : ""}</td>
                                    <td className="align-middle" style={tableStyle}>
                                        <select id={`select-${player.id}`} name="village" class="form-select" onChange={(event) => moves.setVillageAssignment(Number(event.target.value), player.id)}>
                                            <option disabled selected>Select an option from the dropdown list</option>
                                            {G.villages.filter(el => el !== 0).map(village => (
                                                <option disabled={matchData.filter(el => G.playerStats[el.id].village === village).length == G.gameConfig.playersPerVillage} key={village} value={village}>Village {village}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            {G.villages.map(village => (
                <div>
                    {(village > 0) &&
                        <span className="h5 mt-3 mb-2">Village {village}</span>
                    }
                    <table className='table table-striped mb-3'>
                        { (village === 0) &&
                            <thead>
                                <td>Player ID</td>
                                <td>Player Name</td>
                                <td>Is Connected</td>
                                <td>Money</td>
                                <td>Turn Submitted</td>
                                {ctx.phase == "setup" &&
                                    <td>Unassign</td>
                                }
                            </thead>
                        }
                        <tbody>
                            {matchData.filter(el => G.playerStats[el.id].village === village).map(player => (
                                <tr key={player.id}>
                                    <td className="align-middle" style={tableStyle}>{player.id} { (village === 0) && "(Moderator)" }</td>
                                    <td className="align-middle" style={tableStyle}>{player.name ? player.name : ""}</td>
                                    <td className="align-middle" style={tableStyle}>{player.isConnected ? player.isConnected.toString() : ""}</td>
                                    <td className="align-middle" style={tableStyle}>{G.playerStats[player.id].playerMoney}</td>
                                    <td className="align-middle" style={tableStyle}>{G.playerStats[player.id].selectionsSubmitted ? <div> {G.playerStats[player.id].playerWaterFields.flat(4).map((choice, index) => (<img className="bg-wet-dirt border-0" key={index} src={waterChoices[choice]} width="25px"></img>))}<br className="p-0 m-0"/>{G.playerStats[player.id].playerCropFields.flat(4).map((choice, index) => (<img className="bg-dirt border-0" key={index} src={cropChoices[choice]} width="25px"></img>))}</div> : "No"}</td>
                                    {ctx.phase == "setup" &&
                                        <td className="align-middle" style={tableStyle}><button class="btn btn-primary" style={(player.id === 0) ? hideButton : {}} onClick={() => moves.setVillageAssignment('unassigned', player.id)}>Unassign</button></td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <hr/>
            <div className="text-left">
                <h3>Actions for Game State: {ctx.phase}</h3>
                {ctx.phase == "setup" && 
                <div>
                <button className='btn btn-primary' onClick={() => moves.startGame()}>Start Game</button>
                </div>
                }
                {ctx.phase == "playerMoves" && 
                <div>
                <button className='btn btn-primary' onClick={() => {
                    // break up player choices into village groups
                    // make four calls to R code
                    // when each call comes back, save its output
                    // when all calls come back, merge all of the saved outputs into one 


                    let promisesList = []
                    for(let i = 0; i < G.gameConfig.numVillages ; i++) {
                        let waterChoices = ""
                        let cropChoices = ""
                        console.log(PLUMBER_URL)
                        let playerIDs = []
                        let waterDepths = []
                        matchData.map(player => {
                            if( G.playerStats[player.id].village === i+1 ) {
                                playerIDs.push(player.id)
                                waterDepths.push(G.playerStats[player.id].groundwaterDepth)
                                if(player.name != undefined  ) {
                                    G.playerStats[player.id].playerWaterFields.flat(4).map((choice, index) => (waterChoices += String(choice)))
                                    G.playerStats[player.id].playerCropFields.flat(4).map((choice, index) => (cropChoices += String(choice)))
                                }
                                else {
                                    waterChoices += "111122200"
                                    cropChoices += "111111111"
                                }
                            }
                        });
                        promisesList.push(axios.post(`${PLUMBER_URL}/calculate`, null, {params: {
                            Water: waterChoices,
                            Crop: cropChoices,
                            IB: 0,
                            GD: waterDepths.join(","),
                            r0: 1,
                            P: G.gameConfig.probabilityWetYear,
                            Ld: G.gameConfig.avgLengthDrySpell,
                            dP: G.gameConfig.incProbabilityWetYearAnnual,
                            dLd: G.gameConfig.incAvgLengthDrySpellAnnual,
                            QNS: G.gameConfig.optimalFieldAllocationSWSelfish,
                            QFS: G.gameConfig.optimalFieldAllocationSWCommunity,
                            QNG0: G.gameConfig.optimalFieldAllocationGWSelfishMyopic,
                            QNG: G.gameConfig.optimalFieldAllocationGWSelfishSustainable,
                            QFG: G.gameConfig.optimalFieldAllocationGWCommunity,
                            rhoRF: G.gameConfig.ratioReturnsRainVFallow,
                            rhoRS: G.gameConfig.ratioReturnsRainVSurfaceWater,
                            rhoRG: G.gameConfig.ratioReturnsRainVGroundWater,
                            rhoR: G.gameConfig.profitMultiplierGoodBadYear,
                            rhoRe: 0.8,
                            aF: G.gameConfig.profitMarginalFieldFallow,
                            EPR: G.gameConfig.expectedGWRecharge,
                            k: G.gameConfig.recessionConstant,
                            aCr: G.gameConfig.multiplierProfitWaterHighValCrops,
                            lambda: G.gameConfig.ratioMaxLossesVExpectedRecharge,
                            Pen: G.gameConfig.profitPenaltyPerPersonPubInfo,
                            VillageID:i+1,
                            PlayerIDs: playerIDs.join(","),
                            numPlayers: G.gameConfig.playersPerVillage
                        }}).then((res) => {
                            moves.submitVillageDataUpdate(0, res.data)
                        }))
                    }   
                    
                    Promise.all(promisesList).then(() => {
                        moves.advanceYear(0, {})
                    })
                }
                }>End Choice Period of Current Year</button>
                </div>
                }
                {ctx.phase == "moderatorPause" && 
                <div>
                <button className='btn btn-primary mb-2' onClick={() => moves.advanceToPlayerMoves(0)}>Advance to Next Choice Period</button> <br/>
                {[...Array(G.currentRound)].map(function(x, i) {
                 return <><button className='btn btn-primary mb-2' onClick={() => moves.rewind(0,i+1)}>Rewind to Beginning of Year {i+1}</button><br/></>
                })
                 }
                
                {/* <button className='btn btn-primary mb-2' onClick={() => moves.advanceToPlayerMoves(0)}>Rewind to Beginning of Year </button> */}
                </div>
                }
            </div>
        </div>
      

    )
}
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
import empty_tile from "../img/empty_tile.png";

// top options "toptions", if you will.
import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import apple from '../img/apple.png';

const headerStyle = {
    visibility: "hidden"
};

const tableStyle = {
    width: "20%"
}

export function Moderator({ ctx, G, moves, matchData}) {
    console.log(matchData)
    const playerID = useRecoilValue(playerIDAtom);
    const gameID = useRecoilValue(gameIDAtom);
    const waterChoices = [empty_tile, well, cloud, river]
    const cropChoices = [empty_tile, briefcase, apple, leaf]

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
                            </thead>
                        }
                        <tbody>
                            {matchData.filter(el => G.playerStats[el.id].village === village).map(player => (
                                <tr key={player.id}>
                                    <td className="align-middle" style={tableStyle}>{player.id} { (village === 0) && "(Moderator)" }</td>
                                    <td className="align-middle" style={tableStyle}>{player.name ? player.name : ""}</td>
                                    <td className="align-middle" style={tableStyle}>{player.isConnected ? player.isConnected.toString() : ""}</td>
                                    <td className="align-middle" style={tableStyle}>{G.playerStats[player.id].playerMoney}</td>
                                    <td className="align-middle" style={tableStyle}>{G.playerStats[player.id].selectionsSubmitted ? <div> {G.playerStats[player.id].playerWaterFields.flat(4).map((choice, index) => (<img key={index} src={waterChoices[choice]} width="20px"></img>))}<br/>{G.playerStats[player.id].playerCropFields.flat(4).map((choice, index) => (<img key={index} src={cropChoices[choice]} width="20px"></img>))}</div> : "No"}</td>
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
                    let waterChoices = ""
                    let cropChoices = ""
                    console.log(PLUMBER_URL)
                    matchData.map(player => {
                        console.log(G.playerStats)
                        if(player.name != undefined) {
                            G.playerStats[player.id].playerWaterFields.flat(4).map((choice, index) => (waterChoices += String(choice)))
                            G.playerStats[player.id].playerCropFields.flat(4).map((choice, index) => (cropChoices += String(choice)))
                        }
                    });
                    axios.post(`${PLUMBER_URL}/calculate?Wa=${waterChoices}&Cr=${cropChoices}&IB=0&IB=1&GD=0&r0=1&P=0.5&Ld=1&dP=0&dLd=0&QFS=3&QNS=4&QNG=4&QFG=3&rhoRF=1.3&rhoRS=0.7&rhoRG=0.45&rhoR=0.5&aF=1&EPR=2&k=1.25&aCr=2&psi=1`).then((res) => {
                        moves.advanceYear(0, res.data)
                        // console.log(res.data)
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
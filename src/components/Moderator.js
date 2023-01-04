import React from 'react';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { playerIDAtom } from '../atoms/pid';
import { gameIDAtom } from '../atoms/gameid';

export function Moderator({ ctx, G, moves, matchData}) {
    console.log(matchData)
    const playerID = useRecoilValue(playerIDAtom);
    const gameID = useRecoilValue(gameIDAtom);

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
                        <td>2</td>
                        <td>{ctx.numPlayers}</td>
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
            <table className='table table-striped'>
                <thead>
                <td>Player ID</td>
                <td>Player Name</td>
                <td>Is Connected</td>
                <td>Village</td>
                <td>Money</td>
                <td>Turn Submitted</td>
                </thead>
                <tbody>
                    {matchData.map(player => (
                        <tr key={player.id}>
                            <td>{player.id}</td>
                            <td>{player.name ? player.name : ""}</td>
                            <td>{player.isConnected ? player.isConnected.toString() : ""}</td>
                            <td>{G.playerStats[player.id].village}</td>
                            <td>{G.playerStats[player.id].playerMoney}</td>
                            <td>{G.playerStats[player.id].selectionsSubmitted.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
                <button className='btn btn-primary' onClick={() => moves.advanceYear(0)}>Advance Year</button>
                </div>
                }
            </div>
        </div>
      

    )
}
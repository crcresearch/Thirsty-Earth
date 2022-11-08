import React from "react";
import { useRecoilValue } from 'recoil';
import { Navigate, useParams } from "react-router-dom";

import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { Debug } from 'boardgame.io/debug';

import { ThirstyEarth } from "./Game";
import { ButtonBoard } from './Board';

import { gameIDAtom } from "./atoms/gameid";
import { playerIDAtom } from "./atoms/pid";
import { playerCredentialsAtom } from "./atoms/playercred";
import { playerNameAtom } from "./atoms/playername";

import { BASE_URL} from "./config";



export function GameHub() {

    const ThirstyEarthClient = Client({
        game: ThirstyEarth,
        numPlayers: 2,
        board: ButtonBoard,
        multiplayer: SocketIO({ server: BASE_URL }),
        debug: {impl: Debug} 
    });

    const gameID = useRecoilValue(gameIDAtom);
    const playerID = useRecoilValue(playerIDAtom);
    const playerCredentials = useRecoilValue(playerCredentialsAtom);
    const playerName = useRecoilValue(playerNameAtom);

    const urlGameID = useParams();

    const nameIDStyle = {
        textAlign: 'center',
        paddingTop: '36px'
    }

    // If the game ID in the URL and the game ID in the React state + local storage DO NOT match,
    // redirect the user to the error page. This covers situations where a user tries to directly navigate to a game
    // page and they have either an invalid game ID or they try to enter a valid game ID of a game they have not joined.
    if(urlGameID.gameID !== gameID) {
        return( <Navigate to="/error"></Navigate>);  
    }
    else {
        return(
            <div>
                <ThirstyEarthClient 
                    playerID={playerID}
                    credentials={playerCredentials}
                    matchID={gameID}/>
                <div style={nameIDStyle}>
                    <p>Name: {playerName}</p>
                    <p>Room ID: {gameID}</p>
                </div>  
            </div>
        )
    }
    
}
import React from "react";
import { useRecoilValue } from 'recoil';

import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';

import { PushTheButtonFrank} from "./Game";
import { ButtonBoard } from './Board';

import { gameIDAtom } from "./atoms/gameid";
import { playerIDAtom } from "./atoms/pid";
import { playerCredentialsAtom } from "./atoms/playercred";
import { playerNameAtom } from "./atoms/playername";

import { BASE_URL} from "./config";



export function GameHub() {

    const PushTheButtonClient = Client({
        game: PushTheButtonFrank,
        board: ButtonBoard,
        multiplayer: SocketIO({ server: BASE_URL }),
    });

    const gameID = useRecoilValue(gameIDAtom);
    const playerID = useRecoilValue(playerIDAtom);
    const playerCredentials = useRecoilValue(playerCredentialsAtom);
    const playerName = useRecoilValue(playerNameAtom);

    console.log('player ID: ', playerID);

    const nameIDStyle = {
        textAlign: 'center',
        paddingTop: '36px'
    }

    return(
        <div>
            <PushTheButtonClient 
                playerID={playerID}
                credentials={playerCredentials}
                matchID={gameID} />
            <div style={nameIDStyle}>
                <p>Name: {playerName}</p>
                <p>Room ID: {gameID}</p>
            </div>  
        </div>
    )
}
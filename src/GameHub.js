import React from "react";

import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';

import { PushTheButtonFrank} from "./Game";
import { ButtonBoard } from './Board';


export function GameHub() {
    const PushTheButtonClient = Client({
        game: PushTheButtonFrank,
        board: ButtonBoard,
        multiplayer: SocketIO({ server: 'localhost:8000' }),
    });

    return(
        <div>
            <PushTheButtonClient playerID="0" />
            <PushTheButtonClient playerID="1" />
        </div>
    )
}
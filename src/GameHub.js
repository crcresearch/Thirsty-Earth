import React from "react";

import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';

import { PushTheButtonFrank} from "./Game";
import { ButtonBoard } from './Board';

import { BASE_URL} from "./config";



export function GameHub() {
    const PushTheButtonClient = Client({
        game: PushTheButtonFrank,
        board: ButtonBoard,
        multiplayer: SocketIO({ server: BASE_URL }),
    });


    return(
        <div>
            <PushTheButtonClient playerID='0' />
        </div>
    )
}
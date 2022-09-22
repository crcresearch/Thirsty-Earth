import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LobbyClient } from 'boardgame.io/client';
import { useSetRecoilState } from "recoil";

import { gameIDAtom } from "./atoms/gameid";
import { playerIDAtom } from "./atoms/pid";
import { playerCredentialsAtom } from "./atoms/playercred";

const divStyle = {
    textAlign: 'center',
    marginTop: '5%'
}

const extraButtonStyle = {
    marginTop: '18px'
}

const inputStyle = { 
    fontSize: '18px',
    borderRadius: '15px',
    marginBottom: '18px'
}



const lobbyClient = new LobbyClient({ server: 'http://localhost:8080' });



export function EnterName() {
    const setGameID = useSetRecoilState(gameIDAtom);
    const setPlayerID = useSetRecoilState(playerIDAtom);
    const setPlayerCredentials = useSetRecoilState(playerCredentialsAtom);
    const [matchIDQuery, setMatchIDQuery] = useState("");

    function createMatch() {
        lobbyClient.createMatch('push-the-button', {
            numPlayers: 2
        })
        .then(({ matchID }) => {
            lobbyClient.joinMatch( 'push-the-button', 
            matchID,
            {
                playerName: 'bob'
            })
            .then(({ pid, playerCreds }) => {
                setPlayerID(pid);
                setPlayerCredentials(playerCreds);
            });
            setGameID(matchID);
        });
    }

    function joinMatch(matchID) {
        setGameID(matchID);
        lobbyClient.joinMatch(
            'push-the-button',
            matchID,
            {
                playerName: 'alice'
            }
        )
        .then(({ pid, playerCreds}) => {
            setPlayerID(pid);
            setPlayerCredentials(playerCreds);
        });
    }

    return(
        <div style={divStyle}>
            <h2>Enter Game</h2>
            <label htmlFor="roomid">Room ID: </label>
            <input 
                type="text" 
                id="roomid" 
                required 
                style={inputStyle}
                value={matchIDQuery}
                onChange={(event) => {
                    setMatchIDQuery(event.target.value);
                }}
            >
            </input>
            <br />
            <label htmlFor="name">Your name: </label>
            <input type="text" id="name" required style={inputStyle}></input><br />
        
            <button className='button-style' style={extraButtonStyle} onClick={() => joinMatch(matchIDQuery)}>Join</button>
       

            <h2>Create Game</h2>
            <label htmlFor="name">Your name: </label>
            <input type="text" id="name" required style={inputStyle}></input><br />
            <Link to='/game'>
                <button className='button-style' style={extraButtonStyle} onClick={createMatch}>Create</button>
            </Link>  
        </div>
    )
}
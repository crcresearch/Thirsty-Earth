import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';
import { useRecoilValue } from 'recoil';
import { gameIDAtom } from '../atoms/gameid';

const chatBoxStyle = {
    height: "300px",
}
const chatListStyle = {
    listStyle: 'none',
    marginLeft: '-36px',
}


export function ModeratorChatBox
({ chatMessages }) {
    const [playerData, setPlayerData] = useState('');
    const gameID = useRecoilValue(gameIDAtom);
    //const bottomRef = useRef(null);

    //Pull in player data from the server
    useEffect(() => {
        fetch(`${API_URL}/games/push-the-button/${gameID}`, {method: 'GET'})
        .then((response) => response.json())
        .then((data) => {
            setPlayerData(data.players);          
        })
        console.log("playerData", playerData)

    }, [chatMessages, gameID])

    const messageList = chatMessages.slice(0).reverse().map((message) =>   
        // Use array position to map the sender ID to their name 
        // TODO: make a less jank way to do this
        <li key={message.id}><b>{playerData[message.sender].name}</b>: {message.payload}</li>
    )

    return(
        <div className="col-lg bg-lt-navy border-navy position-relative" style={chatBoxStyle}>
            <div class="row bg-med-navy">
                <h5 class="text-center text-light">Chat (Newest on Top)</h5>
            </div>
            <div class="row mt-2 mx-2 moderator-chat-scroll">
                <div id="scroller">
                    <ul style={chatListStyle}>
                        {messageList}
                    </ul>
                    {/*<div ref={bottomRef}/>*/}
                </div>
            </div>
        </div>
    )
}
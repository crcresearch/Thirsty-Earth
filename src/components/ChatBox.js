import React from 'react';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useRecoilValue } from 'recoil';
import { gameIDAtom } from '../atoms/gameid';

const chatBoxStyle = {
    height: "800px",
}
const chatListStyle = {
    listStyle: 'none',
    marginLeft: '-36px',
}


export function ChatBox({ sendMessageFn, chatMessages }) {
    const [message, setMessage] = useState('');
    const [playerData, setPlayerData] = useState('');
    const gameID = useRecoilValue(gameIDAtom);
    const handleSubmit = (m) => {
        if(m !== '') {
            sendMessageFn(m);
            setMessage('');
        }    
    }
    //Pull in player data from the server
    useEffect(() => {
        fetch(`${API_URL}/games/push-the-button/${gameID}`, {method: 'GET'})
        .then((response) => response.json())
        .then((data) => {
            setPlayerData(data.players);          
        })

    })
 
    const messageList = chatMessages.map((message) =>   
        // Use array position to map the sender ID to their name 
        // TODO: make a less jank way to do this
        <li key={message.id}><b>{playerData[message.sender].name}</b>: {message.payload}</li>
    )
    //console.log(list);
    return(
        <div className="card" style={chatBoxStyle}>
            <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Chat</h5>
            </div>
            <div className="card-body chat-scroll">
                <ul style={chatListStyle}>
                    {messageList}
                </ul>
            </div>
            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                    }} />
                <button className="btn btn-primary" type="button" onClick={() =>{handleSubmit(message)}}>Send</button>
            </div>

        </div>
    )
}
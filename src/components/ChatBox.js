import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';
import { useRecoilValue } from 'recoil';
import { gameIDAtom } from '../atoms/gameid';
import { playerIDAtom } from '../atoms/pid';

const chatBoxStyle = {
    height: "800px",
}
const chatListStyle = {
    listStyle: 'none',
    marginLeft: '-36px',
}


export function ChatBox({ sendMessageFn, chatMessages, G }) {
    const [message, setMessage] = useState('');
    const [playerData, setPlayerData] = useState('');
    const gameID = useRecoilValue(gameIDAtom);
    const playerID = useRecoilValue(playerIDAtom);
    const [globalMessages, setGlobalMessages] = useState(false);
    //const bottomRef = useRef(null);

    // useEffect(() => {
    //     bottomRef.current.scrollIntoView({behavior: 'smooth'})
    // }, [chatMessages])

    // If the message box is not empty when the user hits send, send the message.
    const handleSubmit = (m) => {
        if(m !== '') {
            let prefix = globalMessages ? "<GLOBAL> " : `<VILLAGE ${G.playerStats[playerID].village}> `
            sendMessageFn(prefix + m);
            setMessage('');
        }    
    }

    // Allows the user to press "enter" to submit their message instead of using the "send" button
    const handleKeyPress = (e) => {
        if (e.charCode === 13) {
            handleSubmit(message);
        }
    }

    //Pull in player data from the server
    useEffect(() => {
        fetch(`${API_URL}/games/push-the-button/${gameID}`, {method: 'GET'})
        .then((response) => response.json())
        .then((data) => {
            setPlayerData(data.players);          
        })
        console.log("playerData", playerData)

    }, [chatMessages, gameID])

 
    const messageList = chatMessages.filter(message => message.payload.startsWith(globalMessages ? '<GLOBAL> ' : `<VILLAGE ${G.playerStats[playerID].village}> `)).map((message) =>   
        // Use array position to map the sender ID to their name 
        // TODO: make a less jank way to do this
        <li key={message.id}><b>{playerData[message.sender].name}</b>: {message.payload.replace(globalMessages ? '<GLOBAL> ' : `<VILLAGE ${G.playerStats[playerID].village}> `, '')}</li>
    )

    return(
        <div className="card" style={chatBoxStyle}>
            <div className="card-header d-flex justify-content-between align-items-center p-3">
                <div>
            <h3 className='text-center'>Chat</h3>
            <div className='d-flex align-items-center container'>
            <button className={globalMessages? "btn btn-outline-succes" : "btn btn-primary"} onClick={() =>{setGlobalMessages(false)}}><h5 className="mb-0">Village</h5></button>
            <button className={!globalMessages? "btn btn-outline-succes" : "btn btn-primary"} onClick={() =>{setGlobalMessages(true)}}><h5 className="mb-0">Global</h5></button></div>
            </div>
            </div>
            <div className="card-body chat-scroll">
                <div id="scroller">
                    <ul style={chatListStyle}>
                        {messageList}
                    </ul>
                    {/*<div ref={bottomRef}/>*/}
                </div>     
            </div>
            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                    }}
                    onKeyPress={handleKeyPress}
                     />
                <button className="btn btn-primary" type="button" onClick={() =>{handleSubmit(message)}} >Send</button>
            </div>

        </div>
    )
}
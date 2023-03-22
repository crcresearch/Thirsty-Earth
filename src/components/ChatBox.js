import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';
import { useRecoilValue } from 'recoil';
import { gameIDAtom } from '../atoms/gameid';
import { playerIDAtom } from '../atoms/pid';

const chatBoxStyle = {
    height: "780px",
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
        <div className="col-lg bg-lt-navy border-navy position-relative" style={chatBoxStyle}>
            <div class="row bg-med-navy">
                <h5 class="pt-1 text-center text-light">Chat</h5>
            </div>
            <nav class="nav nav-pills nav-fill nav-navy border-bottom border-dark pb-2 mt-2 ">
                <button className={globalMessages ? "nav-link" : "nav-link active"} aria-current="page" onClick={() =>{setGlobalMessages(false)}}><h5 className="mb-0">Village</h5></button>
                <button className={!globalMessages ? "nav-link" : "nav-link active"} onClick={() =>{setGlobalMessages(true)}}><h5 className="mb-0">Global</h5></button>
            </nav>
            <div class="row mt-2 chat-scroll">
                <div id="scroller">
                    <ul style={chatListStyle}>
                        {messageList}
                    </ul>
                    {/*<div ref={bottomRef}/>*/}
                </div>
            </div>
            <div class="row d-block d-lg-none">
                <div class="col">
                    <div class="input-group my-3">
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
            </div>      
            <div class="row d-none d-lg-block">
                <div class="col position-absolute bottom-0 end-1">
                    <div class="input-group my-3">
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
            </div>
        </div>
    )
}
import React from 'react';
import { useState } from 'react';

const chatBoxStyle = {
    height: "800px",
}
const chatListStyle = {
    listStyle: 'none',
    marginLeft: '-36px',
}
export function ChatBox({ sendMessageFn, chatMessages }) {
    const [message, setMessage] = useState('');
    const handleSubmit = (m) => {
        if(m !== '') {
            sendMessageFn(m);
            setMessage('');
            console.log(chatMessages);
        }
        
    }


    const messageList = chatMessages.map((message) =>
        
        <li key={message.id}><b>{message.sender}</b>: {message.payload}</li>

    )
    //console.log(list);
    return(
        <div className="card" style={chatBoxStyle}>
            <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Chat</h5>
            </div>
            <div className="card-body">
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
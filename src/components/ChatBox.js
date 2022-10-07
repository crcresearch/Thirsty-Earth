import React from 'react';


const chatBoxStyle = {
    height: "800px",
}
export function ChatBox() {
    return(
        <div className="card" style={chatBoxStyle}>
            <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Chat</h5>
            </div>
            <div className="card-body">
                <p>placeholder</p>
            </div>
            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                <input type="text" className="form-control" placeholder="Type your message here..." />
                <button className="btn btn-primary" type="button">Send</button>
            </div>

        </div>
    )
}
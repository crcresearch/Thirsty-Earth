import React from 'react';
import { ChatBox } from './components/ChatBox';
import { PreviousRounds } from './components/PreviousRounds';
import { MainField } from './components/MainField';

export function ButtonBoard({ ctx, G, moves, sendChatMessage, chatMessages }) {
    return (
        <div className="container">
            <div className="row title-font">
                <h1>Year: 1</h1>
                <h1>Village: Test</h1>
            </div>
            <div className="row">
                <div className="col">
                    {/*pass down chat functions and objects as props so that the chatbox has access to them.*/}
                    <ChatBox sendMessageFn={sendChatMessage} chatMessages={chatMessages}/>
                </div>
                <div className="col-6">
                    <MainField />
                </div>
                <div className="col">
                    <PreviousRounds />
                </div>
            </div>
        </div>
    )
}
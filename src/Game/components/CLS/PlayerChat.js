import React, { useState, useEffect } from "react";
import uniqid from "uniqid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./PlayerChat.scss";
import { propTypes } from "react-bootstrap/esm/Image";
import ChatScreen from "./ChatScreen";

const handleKeyUp = (e) => {
  e.preventDefault();
  if (e.keyCode === 13) {
    // enter key: another way to send a message
    document.getElementById("send-button").click();
  }
};

const PlayerChat = ({ G, ctx, playerID, moves }) => {

  const [msg, setMsg] = useState("");

  let [player, setPlayer] = useState("Global");
  
  let handlePlayerChange = (e) => {
    setPlayer(e.target.value)
  }

    // populate player-to-player chats
    const playerChat = [];
    for (let i=0; i < ctx.numPlayers; i++){
      playerChat.push({
      player1: parseInt(playerID),
      player2: i,
      chat: [],
    });
    }

    for (let i = 0; i < G.chat.length; i++) {
        for (let j = 0; j < playerChat.length; j++) {
          if (playerChat[j].player2 === parseInt(G.chat[i].id)) {
            playerChat[j].chat.push(G.chat[i])
          }
       }
    }

    for (let i = 0; i < G.chat.length; i++) {
      if (parseInt(playerID) === parseInt(G.chat[i].id)) {
        playerChat[parseInt(playerID)].chat.push(G.chat[i])
      }
    }

  localStorage.setItem("playerChat", playerChat);
  console.log(localStorage)
  //console.log(playerChat)
  //console.log(localStorage.getItem("playerChat")[0].player1)

  /* cycle through players template
  for (let i=0; i <= ctx.numPlayers; i++){

    };
  */

  const message = (content, receiver) => {
    moves.message(playerID, content, receiver);
    document.getElementById("player-msg").value = "";
    setMsg("");
  };
  console.log(G.chat)

  useEffect(() => {
    // when a new message appear, automatically scroll chat box (when applicable) to bottom to show it
    let objDiv = document.getElementById("scrollBottom");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [G.chat]);

  const playerNames = [];
  const dropOptions = [];
  for (let i=0; i < ctx.numPlayers; i++){
  playerNames.push(G.players[i].name)
  dropOptions.push({label: G.players[i].name, value: G.players[i].id})
  }

if (player === "Global"){
  return (
    <>
      <div id="scrollBottom" className="msgs">
        {G.chat.map((msg) => {
          let className = "msg ";
            return (
              <div id="playerMsg" className={className} key={uniqid()}>
                <span className="msg-sender">{G.players[msg.id].name + ": "}</span>
                {msg.content}
              </div>
            )
          })}
      </div>
      <div className="chat-form">
      <select
        id="player-drop"
        value={player}
        onChange={handlePlayerChange}>
          <option value="Global">Global</option> 
          {dropOptions.map((player) => <option value={player.value}>{player.label}</option>)}
      </select>
        <input
          id="player-msg"
          type="text"
          maxLength="70"
          placeholder="Enter Message"
          onChange={(e) => setMsg(e.target.value)}
          onKeyUp={(e) => handleKeyUp(e)}
          autoComplete="off"
        />
        <button id="send-button" className="send-btn" onClick={() => message(msg, player)} disabled={msg.length === 0}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </>
  )}

  else {
    return (
      <>
        <div id="scrollBottom" className="msgs">
          {playerChat[parseInt(player)].chat.map((msg) => {
            let className = "msg ";
              return (
                <div id="playerMsg" className={className} key={uniqid()}>
                  <span className="msg-sender">{G.players[msg.id].name + ": "}</span>
                  {msg.content}
                </div>
              )
            })}
        </div>
        <div className="chat-form">
        <select
          id="player-drop"
          value={player}
          onChange={handlePlayerChange}>
            <option value="Global">Global</option> 
            {dropOptions.map((player) => <option value={player.value}>{player.label}</option>)}
        </select>
          <input
            id="player-msg"
            type="text"
            maxLength="70"
            placeholder="Enter Message"
            onChange={(e) => setMsg(e.target.value)}
            onKeyUp={(e) => handleKeyUp(e)}
            autoComplete="off"
          />
          <button id="send-button" className="send-btn" onClick={() => message(msg, player)} disabled={msg.length === 0}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </>
    )}

};
export default PlayerChat;
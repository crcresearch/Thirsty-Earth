import React, { useState, useEffect } from "react";
import uniqid from "uniqid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./PlayerChat.scss";
import { propTypes } from "react-bootstrap/esm/Image";

const handleKeyUp = (e) => {
  e.preventDefault();
  if (e.keyCode === 13) {
    // enter key: another way to send a message
    document.getElementById("send-button").click();
  }
};

const PlayerChat = ({ G, ctx, playerID, moves }) => {

  const [msg, setMsg] = useState("");

  // Stores player selected in dropdown
  let [player, setPlayer] = useState("Choose a Player");
  
  let handlePlayerChange = (e) => {
    setPlayer(e.target.value)
  }

  // Populate player-to-player chats; must be initialized OUTSIDE of PlayerChat.js (preferably in Game.js)
  // or else playerChat will constantly be reinitialized
  const playerChat = [];
  for (let i=0; i < ctx.numPlayers; i++){
    for (let j=0; j < ctx.numPlayers; j++){
    playerChat.push({
    player1: i,
    player2: j,
    chat: [],
  })
  }};

  // Modified message function to reflect filtering with receiver value
  const message = (content, receiver) => {
    if (receiver !== "Choose a Player"){
      playerChat[receiver].chat.push({content, receiver});
      document.getElementById("player-msg").value = "";
      setMsg("");
    }
    else {
      moves.message(playerID, content, receiver);
      document.getElementById("player-msg").value = "";
      setMsg("");
    }
  };

  useEffect(() => {
    // when a new message appear, automatically scroll chat box (when applicable) to bottom to show it
    let objDiv = document.getElementById("scrollBottom");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [G.playerChat]);

  // Creates values for dropdown menu
  const playerNames = [];
  const dropOptions = [];
  for (let i=0; i < ctx.numPlayers; i++){
  playerNames.push(G.players[i].name)
  dropOptions.push({label: G.players[i].name, value: G.players[i].id})
  }

  // Example of how chat mapping would be filtered determmined by player selected in dropdown
  for (let i=0; i <= ctx.numPlayers; i++){
  if (player.value !== "Choose a Player"){
  return (
    <>
      <div id="scrollBottom" className="msgs">
        {playerChat[parseInt(player)].chat.map((msg) => {
          let className = "msg ";
            return (
              <div id="playerMsg" className={className} key={uniqid()}>
                {playerChat[i].chat}
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
          <option value="Choose a Player">Choose a Player</option>
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
        <button id="send-button" className="send-btn" onClick={() => message(msg, player.value)} disabled={msg.length === 0}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </>
  );
}}};

export default PlayerChat;
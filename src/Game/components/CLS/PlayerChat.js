import React, { useState, useEffect } from "react";
import uniqid from "uniqid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./PlayerChat.scss";
//import PlayerDropdown from "./PlayerDropdown";

const handleKeyUp = (e) => {
  e.preventDefault();
  if (e.keyCode === 13) {
    // enter key: another way to send a message
    document.getElementById("send-button").click();
  }
};

const PlayerChat = (props) => {

  const { G, ctx, playerID, moves } = props;
  const [msg, setMsg] = useState("");

  const message = (content, sender, receiver) => {
    receiver = document.getElementById("player-drop").value;
    sender = G.currentPlayer;
    moves.message(playerID, content, sender, receiver);
    document.getElementById("player-msg").value = "";
    setMsg("");
  };

  useEffect(() => {
    // when a new message appear, automatically scroll chat box (when applicable) to bottom to show it
    let objDiv = document.getElementById("scrollBottom");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [G.chat]);

  const playerNames = [];
  const dropOptions = [];
  for (let i=0; i < ctx.numPlayers; i++){
  playerNames.push(props.G.players[i].name)
  dropOptions.push({label: props.G.players[i].name, value: props.G.players[i].name})
  }

  let [player, setPlayer] = useState("Choose a Player");
  
  let handlePlayerChange = (e) => {
    setPlayer(e.target.value)
  }

  return (
    <>
      <div id="scrollBottom" className="msgs">
        {G.chat.map((msg) => {
          let className = "msg ";
            if (msg.receiver === G.currentPlayer && msg.sender === G.currentPlayer) {
            return (
              <div id="playerMsg" className={className} key={uniqid()}>
                <span className="msg-sender">{G.players[msg.id].name + ": "}</span>
                {msg.content}
              </div>
            );
          }
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
        <button id="send-button" className="send-btn" onClick={() => message(msg, G.currentPlayer, document.getElementById("player-drop").value)} disabled={msg.length === 0}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </>
  );
};

export default PlayerChat;

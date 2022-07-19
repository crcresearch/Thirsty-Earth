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

  var prevChatLen = G.chat.length;

  const [msg, setMsg] = useState("");

  let [player, setPlayer] = useState("Choose a Player");
  
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

  /* cycle through players template
  for (let i=0; i <= ctx.numPlayers; i++){

    };
  */

  const message = (content, receiver) => {
    moves.message(playerID, content, receiver);
    document.getElementById("player-msg").value = "";
    setMsg("");

    //playerChat[receiver].chat.push({content, receiver});
    prevChatLen += 1;
    console.log(G.chat)
    console.log(playerID)
    console.log(player.value)
  };

  useEffect(() => {
    // when a new message appear, automatically scroll chat box (when applicable) to bottom to show it
    let objDiv = document.getElementById("scrollBottom");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [G.playerChat]);

  const playerNames = [];
  const dropOptions = [];
  for (let i=0; i < ctx.numPlayers; i++){
  playerNames.push(G.players[i].name)
  dropOptions.push({label: G.players[i].name, value: G.players[i].id})
  }

  for (let i=0; i <= ctx.numPlayers; i++){
  if (player.value === "global"){
  return (
    <>
      <div id="scrollBottom" className="msgs">
        {playerChat[i].chat.map((msg) => {
          let className = "msg ";
            return (
              <div id="playerMsg" className={className} key={uniqid()}>
                {playerChat[i].chat}
                <span className="msg-sender">{G.players[msg.id].name + ": "}</span>
                {msg.content}
              </div>
            )
          })}
        {playerChat[i].chat.map((msg) => {
          let className = "msg ";
            return (
              <div id="playerMsg" className={className} key={uniqid()}>
                <span className="msg-sender">{G.players[msg.id].name + ": "}</span>
                {msg.content}
              </div>
            );
          })
        }
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
}
  else {
    return (
      <>
        <div id="scrollBottom" className="msgs">
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
  }
};
};

export default PlayerChat;
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LobbyClient } from "boardgame.io/client";
import { useSetRecoilState } from "recoil";

import { gameIDAtom } from "./atoms/gameid";
import { playerIDAtom } from "./atoms/pid";
import { playerCredentialsAtom } from "./atoms/playercred";
import { playerNameAtom } from "./atoms/playername";

import { API_URL } from "./config";
import { GAME_NAME } from "./config";

const extraButtonStyle = {
  marginTop: "18px",
};

const inputStyle = {
  fontSize: "18px",
  borderRadius: "15px",
};

const lobbyClient = new LobbyClient({ server: API_URL });

export function EnterName() {
  const setGameID = useSetRecoilState(gameIDAtom);
  const setPlayerID = useSetRecoilState(playerIDAtom);
  const setPlayerCredentials = useSetRecoilState(playerCredentialsAtom);
  const setPlayerNameAtom = useSetRecoilState(playerNameAtom);

  const [matchIDQuery, setMatchIDQuery] = useState("");
  const [joiningPlayerName, setJoiningPlayerName] = useState("");
  const [agreeTOS, setAgreeTOS] = useState(false);

  const [errorText, setErrorText] = useState("")

  // const [turnTimer, setTurnTimer] = React.useState(null);

  let navigate = useNavigate();

  function joinMatch(matchID, playerName) {
    setGameID(matchID);
    lobbyClient
      .joinMatch(GAME_NAME, matchID, {
        playerName: playerName,
      })
      .then((playerInfo) => {
        setPlayerID(playerInfo.playerID);
        setPlayerCredentials(playerInfo.playerCredentials);
        setPlayerNameAtom(playerName);
        navigate(`/game/${matchID}`, { replace: true });
      })
      .catch((error) => {
        setErrorText('Invalid Room ID');
      });
  }

  let alert = "";

  if(errorText !== "") {
    alert = <div className="alert alert-danger" role="alert">{errorText}</div>;
  }
  else {
    alert = "";
  }

  return (
    <div className="container mt-4">
      <nav class="navbar">
      <a class="navbar-brand"></a>
        <a href="/game-creation" class="btn btn-primary my-2 my-sm-0">Create Game</a>
      </nav>
      <h2 className="title-font text-center mb-4">Thirsty Earth Lobby</h2>
      <div className="row">
        <div className="col-6 offset-lg-3">
          <h2 className="subtitle-font text-center">Join Game</h2>
          <div className="mb-3">
            {/* <label htmlFor="roomid"  className="form-label">Room ID: </label> */}
            {alert}
            <input
              type="text"
              className="form-control"
              id="roomid"
              aria-describedby="roomid-input"
              required
              style={inputStyle}
              value={matchIDQuery}
              onChange={(event) => {
                setMatchIDQuery(event.target.value);
              }}
              placeholder="Room ID"
            ></input>
          </div>
          <input
            type="text"
            id="name"
            placeholder="Your name"
            required
            className="form-control"
            style={inputStyle}
            value={joiningPlayerName}
            onChange={(event) => {
              setJoiningPlayerName(event.target.value);
            }}
          ></input>
          <input className="mt-3 mx-2" type="checkbox" id="isModerated" value={agreeTOS} onChange={e => setAgreeTOS(e.target.checked)} />
          <label htmlFor="isModerated">  I confirm that I have read and agreed to <a href="https://drive.google.com/file/d/1WKkwSIIi13tOaot3C_yh6fZTwO0zbcZB/view?usp=sharing" target="_blank">the consent form for research found here</a> </label>

          <div className="d-flex flex-row-reverse ">
            <button
              type="button"
              disabled={!agreeTOS}
              className="btn btn-block btn-primary"
              style={extraButtonStyle}
              onClick={() => joinMatch(matchIDQuery, joiningPlayerName)}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

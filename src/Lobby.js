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

export function JoinGame() {
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
    if (matchID === JSON.parse(localStorage.getItem("gameID"))) {
      lobbyClient
      .updatePlayer(GAME_NAME, matchID, {
        playerID: JSON.parse(localStorage.getItem("playerID")),
        credentials: JSON.parse(localStorage.getItem("playerCredentials")),
        newName: playerName,
      })
      .then(() => {
        setPlayerNameAtom(playerName);
        navigate(`/game/${matchID}`, { replace: true });
      })
      .catch((error) => {
        setErrorText('Invalid Game ID');
      });
    } else {
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
        setErrorText('Invalid Game ID');
      });
    }
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
      <nav className="navbar">
        <a className="navbar-brand" target="_blank" href="https://drive.google.com/file/d/1CTSnA8LY_b65BZO8yILr6W98T6LuChep/view?usp=sharing">
          Students Start Here
        </a>
        <a href="/game-creation" className="btn btn-navy my-2 my-sm-0">
          Create Game
          <br></br>
          (for Instructor)
        </a>
      </nav>
      <h2 className="title-font text-center mb-4">Thirsty Earth Lobby</h2>
      <div className="row">
        <div className="col-lg-6 offset-lg-3">
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
              placeholder="Game ID"
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
          <div class="row row-cols-2 mt-3 ">
            <div class="col col-1"><input type="checkbox" id="isModerated" value={agreeTOS} onChange={e => setAgreeTOS(e.target.checked)} /></div>
            <div class="col col-11"><label htmlFor="isModerated">  I confirm that I have read and agreed to <a href="https://drive.google.com/file/d/1WKkwSIIi13tOaot3C_yh6fZTwO0zbcZB/view?usp=sharing" target="_blank">the consent form for research found here</a> </label></div>
          </div>

          <div className="d-flex flex-row-reverse">
            <button
              type="button"
              disabled={!agreeTOS}
              className="btn btn-primary btn-block"
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

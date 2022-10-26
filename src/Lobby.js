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
  const [creatingPlayerName, setCreatingPlayerName] = useState("");

  const [errorText, setErrorText] = useState("")

  let navigate = useNavigate();

  function createMatch(playerName) {
    lobbyClient
      .createMatch("thirsty-earth", {
        numPlayers: 2,
      })
      .then(({ matchID }) => {
        lobbyClient
          .joinMatch("thirsty-earth", matchID, {
            playerName: playerName,
          })
          .then((playerInfo) => {
            console.log(playerInfo);
            setPlayerID(playerInfo.playerID);
            setPlayerCredentials(playerInfo.playerCredentials);

            navigate(`/game/${matchID}`, { replace: true });
          });
        setGameID(matchID);
        setPlayerNameAtom(playerName);
        
        console.log(matchID);
      });
  }

  function joinMatch(matchID, playerName) {
    setGameID(matchID);
    lobbyClient
      .joinMatch("thirsty-earth", matchID, {
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
      <h2 className="title-font text-center mb-4">Thirsty Earth Lobby</h2>
      <div className="row">
        <div className="col-12 col-lg-4 offset-lg-2">
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

          <div className="d-flex flex-row-reverse ">
            <button
              type="button"
              className="btn btn-block btn-primary"
              style={extraButtonStyle}
              onClick={() => joinMatch(matchIDQuery, joiningPlayerName)}
            >
              Join
            </button>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <h2 className="subtitle-font text-center">Create Game</h2>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Your Name"
            required
            style={inputStyle}
            value={creatingPlayerName}
            onChange={(event) => {
              setCreatingPlayerName(event.target.value)
            }}
          ></input>
          <div className="d-flex flex-row-reverse ">
            <button
              type="button"
              className="btn btn-primary"
              style={extraButtonStyle}
              onClick={() => {createMatch(creatingPlayerName)}}
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LobbyClient } from "boardgame.io/client";
import { useSetRecoilState } from "recoil";

import { gameIDAtom } from "./atoms/gameid";
import { playerIDAtom } from "./atoms/pid";
import { playerCredentialsAtom } from "./atoms/playercred";
import { API_URL } from "./config";

const divStyle = {
  textAlign: "center",
  marginTop: "5%",
};

const extraButtonStyle = {
  marginTop: "18px",
};

const inputStyle = {
  fontSize: "18px",
  borderRadius: "15px",
};

const lobbyClient = new LobbyClient({ server: "http://localhost:8080" });

export function EnterName() {
  const setGameID = useSetRecoilState(gameIDAtom);
  const setPlayerID = useSetRecoilState(playerIDAtom);
  const setPlayerCredentials = useSetRecoilState(playerCredentialsAtom);
  const [matchIDQuery, setMatchIDQuery] = useState("");
  let navigate = useNavigate();

  function createMatch() {
    lobbyClient
      .createMatch("push-the-button", {
        numPlayers: 2,
      })
      .then(({ matchID }) => {
        lobbyClient
          .joinMatch("push-the-button", matchID, {
            playerName: "bob",
          })
          .then((playerInfo) => {
            console.log(playerInfo);
            setPlayerID(playerInfo.playerID);
            setPlayerCredentials(playerInfo.playerCredentials);

            navigate("/game", { replace: true });
          });
        setGameID(matchID);
        console.log(matchID);
      });
  }

  function joinMatch(matchID) {
    setGameID(matchID);
    lobbyClient
      .joinMatch("push-the-button", matchID, {
        playerName: "alice",
      })
      .then((playerInfo) => {
        setPlayerID(playerInfo.playerID);
        setPlayerCredentials(playerInfo.playerCredentials);
        navigate("/game", { replace: true });
      });
  }

  return (
    <div className="container mt-4">
      <h2 className="title-font text-center mb-4">Thirsty Earth Lobby</h2>
      <div className="row">
        <div className="col-12 col-lg-4 offset-lg-2">
          <h2 className="subtitle-font text-center">Join Game</h2>
          <div className="mb-3">
            {/* <label htmlFor="roomid"  className="form-label">Room ID: </label> */}
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
          ></input>

          <div className="d-flex flex-row-reverse ">
            <button
              type="button"
              className="btn btn-block btn-primary"
              style={extraButtonStyle}
              onClick={() => joinMatch(matchIDQuery)}
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
          ></input>
          <div className="d-flex flex-row-reverse ">
            <button
              type="button"
              className="btn btn-primary"
              style={extraButtonStyle}
              onClick={createMatch}
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

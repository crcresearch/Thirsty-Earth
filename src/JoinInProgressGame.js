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
        <div className="col-lg-6 offset-lg-3">
          <h4 className="text-center">If you are here to join the game that began on 03/27/2023, <a href="/game/2GSl6NFNuel">click here</a>!</h4>
        </div>
      </div>
    </div>
  );
}

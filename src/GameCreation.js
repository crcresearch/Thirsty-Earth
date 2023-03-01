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
  marginRight: "5px",
  marginBottom: "20px",
};

const inputStyle = {
  fontSize: "18px",
  borderRadius: "15px",
};

const collapseHidden = {
    display: "none"
}

const lobbyClient = new LobbyClient({ server: API_URL });

export function CreateGame() {
    const setGameID = useSetRecoilState(gameIDAtom);
    const setPlayerID = useSetRecoilState(playerIDAtom);
    const setPlayerCredentials = useSetRecoilState(playerCredentialsAtom);
    const setPlayerNameAtom = useSetRecoilState(playerNameAtom);
    const [creatingPlayerName, setCreatingPlayerName] = useState("");
    const [visible, setVisible] = useState(false)


    const [moderated, setModerated] = React.useState(false);
    const [numVillages, setNumVillages] = React.useState("");
    const [numPlayers, setNumPlayers] = React.useState("");
    const [numYears, setNumYears] = React.useState("");
    // R parameters (basic)
    const [probabilityWetYear, setProbabilityWetYear] = React.useState(0.5); // P
    const [avgLengthDrySpell, setAvgLengthDrySpell] = React.useState(1); // Ld
    const [incProbabilityWetYearAnnual, setIncProbabilityWetYearAnnual] = React.useState(0); // dP
    const [incAvgLengthDrySpellAnnual, setIncAvgLengthDrySpellAnnual] = React.useState(0); // dLd
    const [profitMultiplierGoodBadYear, setProfitMultiplierGoodBadYear] = React.useState(0.5); // rhoR
    const [ratioReturnsRainVFallow, setRatioReturnsRainVFallow] = React.useState(1.3); // rhoRF
    const [ratioReturnsRainVSurfaceWater, setRatioReturnsRainVSurfaceWater] = React.useState(0.35); // rhoRS
    const [ratioReturnsRainVGroundWater, setRatioReturnsRainVGroundWater] = React.useState(0.25); // rhoRG
    const [multiplierProfitWaterHighValCrops, setMultiplierProfitWaterHighValCrops] = React.useState(2); // aCr
    const [profitPenaltyPerPersonPubInfo, setProfitPenaltyPerPersonPubInfo] = React.useState(2); // Pen
    // R parameters (advanced)
    const [optimalFieldAllocationSWSelfish, setOptimalFieldAllocationSWSelfish] = React.useState(4); // QNS
    const [optimalFieldAllocationSWCommunity, setOptimalFieldAllocationSWCommunity] = React.useState(3); // QFS
    const [optimalFieldAllocationGWSelfishMyopic, setOptimalFieldAllocationGWSelfishMyopic] = React.useState(5); // QNG0
    const [optimalFieldAllocationGWSelfishSustainable, setOptimalFieldAllocationGWSelfishSustainable] = React.useState(3); // QNG
    const [optimalFieldAllocationGWCommunity, setOptimalFieldAllocationGWCommunity] = React.useState(2); // QFG
    const [profitMarginalFieldFallow, setProfitMarginalFieldFallow] = React.useState(1); // aF
    const [expectedGWRecharge, setExpectedGWRecharge] = React.useState(5); // EPR
    const [recessionConstant, setRecessionConstant] = React.useState(1.25); // k
    const [ratioMaxLossesVExpectedRecharge, setRatioMaxLossesVExpectedRecharge] = React.useState(0.1); // lambda

    // const [turnTimer, setTurnTimer] = React.useState(null);
    const [gameLabel, setGameLabel] = React.useState("");

    let navigate = useNavigate();

    function createMatch(playerName) {
        lobbyClient
            .createMatch(GAME_NAME, {
                numPlayers: numPlayers * numVillages + (moderated ? 1: 0), 
                setupData: {
                    numYears: numYears, 
                    playersPerVillage: numPlayers, 
                    numVillages: numVillages,
                    probabilityWetYear: probabilityWetYear, // P
                    avgLengthDrySpell: avgLengthDrySpell, // Ld
                    incProbabilityWetYearAnnual: incProbabilityWetYearAnnual, // dP
                    incAvgLengthDrySpellAnnual: incAvgLengthDrySpellAnnual, // dLd
                    profitMultiplierGoodBadYear: profitMultiplierGoodBadYear, // rhoR
                    ratioReturnsRainVFallow: ratioReturnsRainVFallow, // rhoRF
                    ratioReturnsRainVSurfaceWater: ratioReturnsRainVSurfaceWater, // rhoRS
                    ratioReturnsRainVGroundWater: ratioReturnsRainVGroundWater, // rhoRG
                    multiplierProfitWaterHighValCrops: multiplierProfitWaterHighValCrops, // aCr
                    profitPenaltyPerPersonPubInfo: profitPenaltyPerPersonPubInfo, // Pen
                    optimalFieldAllocationSWSelfish: optimalFieldAllocationSWSelfish, // QNS
                    optimalFieldAllocationSWCommunity: optimalFieldAllocationSWCommunity, // QFS
                    optimalFieldAllocationGWSelfishMyopic: optimalFieldAllocationGWSelfishMyopic, // QNG0
                    optimalFieldAllocationGWSelfishSustainable: optimalFieldAllocationGWSelfishSustainable, // QNG
                    optimalFieldAllocationGWCommunity: optimalFieldAllocationGWCommunity, // QFG
                    profitMarginalFieldFallow: profitMarginalFieldFallow, // aF
                    expectedGWRecharge: expectedGWRecharge, // EPR
                    recessionConstant: recessionConstant, // k
                    ratioMaxLossesVExpectedRecharge: ratioMaxLossesVExpectedRecharge, // lambda
                    moderated: moderated, 
                    turnLength: 30000, 
                    maxYears: 25, 
                    gameLabel: gameLabel
                }, unlisted: true
            })
            .then(({ matchID }) => {
                lobbyClient
                    .joinMatch(GAME_NAME, matchID, {
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

    function submissionErrors(QFS, QNS, QFG, QNG, QNG0, k) {
        let errorText = "";
        let alert = "";

        if (2*QFS <= QNS) {
            errorText += "2*QFS <= QNS: 2*QFS must be larger than QNS!/n";
        }
        if (2*QFG == QNG) {
            errorText += "2*QFG == QNG: 2*QFG cannot be equal to QNG!/n";
        }
        if (QNG/QFG >= 2) {
            errorText += "QNG/QFG >= 2: QNG/QFG must be less than 2!/n";
        }
        if (QNG*(k+1) <= QNG0) {
            errorText += "QNG*(k+1) <= QNG0: QNG*(k+1) must be larger than QNG0!/n";
        }
        
        if (errorText !== "") {
            alert = <div className="alert alert-danger" role="alert">{errorText}</div>;
        }

        return alert;
    }

    function submissionWarnings(rhoRS, rhoRG, rhoRF, QNG) {
        let warningText = "";
        let alert = "";

        if (rhoRS >= 1) {
            warningText += "rhoRS >= 1: Surface water should be more profitable than rain water!/n";
        }
        if (rhoRG >= 1) {
            warningText += "rhoRG >= 1: Groundwater should be more profitable than rain water!/n";
        }
        if (rhoRS < rhoRG) {
            warningText = "rhoRS < rhoRG: Value of irrigation types should be GW > SW > RW!/n";
        }
        if (rhoRF <= 1) {
            warningText += "rhoRF <= 1: Expected profit from rain fed crops should be higher than fallow!/n";
        }
        if (rhoRF >= 1.5) {
            warningText += "rhoRF >= 1.5: Rain fed crops should be less profitable than fallow in a bad year!/n";
        }
        if (QNG == 4) {
            warningText += "QNG == 4: SW profits become negative before GW!/n";
        }

        if (warningText !== "") {
            alert = <div className="alert alert-warning" role="alert">{warningText}</div>;
        }

        return alert;
    }

    return (
        <div className="container mt-4">
            <nav class="navbar">
                <a class="navbar-brand"></a>
                <a href="/" class="btn btn-primary my-2 my-sm-0">Join Game</a>
            </nav>
            <h2 className="title-font text-center mb-4">Thirsty Earth Lobby</h2>
            <div className="row">
                <div className="col-6 offset-lg-3">
                    <h2 className="subtitle-font text-center">Create Game</h2>
                    <input
                      type="text"
                      id="name"
                      className="form-control mb-2"
                      placeholder="Your Name"
                      required
                      style={inputStyle}
                      value={creatingPlayerName}
                      onChange={(event) => {
                        setCreatingPlayerName(event.target.value)
                      }}
                    ></input>
                    <input
                      type="number"
                      id="numVillages"
                      className="form-control  mb-2"
                      placeholder="Number of Villages"
                      required
                      style={inputStyle}
                      value={numVillages}
                      onChange={(event) => {
                        setNumVillages(event.target.valueAsNumber)
                      }}
                    ></input>
                    <input
                      type="number"
                      id="playersPerVillage"
                      className="form-control  mb-2"
                      placeholder="Players Per Village"
                      style={inputStyle}
                      value={numPlayers}
                      onChange={(event) => {
                        setNumPlayers(event.target.valueAsNumber)
                      }}
                    ></input>
                    <input
                      type="number"
                      id="numYears"
                      className="form-control mb-2"
                      placeholder="Number Of Years"
                      required
                      style={inputStyle}
                      value={numYears}
                      onChange={(event) => {
                        setNumYears(event.target.valueAsNumber)
                      }}
                    ></input>
                    <input
                      type="text"
                      id="gameLabel"
                      className="form-control mb-2"
                      placeholder="My Game Nickname"
                      style={inputStyle}
                      value={gameLabel}
                      onChange={(event) => {
                        setGameLabel(event.target.value)
                      }}
                    ></input>
                    <div className="row mt-3">
                        <div className="col-6">
                        <label htmlFor="probabilityWetYear">P:</label>
                            <input
                              type="number"
                              id="probabilityWetYear"
                              className="form-control mb-2"
                              placeholder="P"
                              required
                              style={inputStyle}
                              value={probabilityWetYear}
                              onChange={(event) => {
                                setProbabilityWetYear(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="avgLengthDrySpell">Ld:</label>
                            <input
                              type="number"
                              id="avgLengthDrySpell"
                              className="form-control mb-2"
                              placeholder="Ld"
                              required
                              style={inputStyle}
                              value={avgLengthDrySpell}
                              onChange={(event) => {
                                setAvgLengthDrySpell(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="incProbabilityWetYearAnnual">dP:</label>
                            <input
                              type="number"
                              id="incProbabilityWetYearAnnual"
                              className="form-control mb-2"
                              placeholder="dP"
                              required
                              style={inputStyle}
                              value={incProbabilityWetYearAnnual}
                              onChange={(event) => {
                                setIncProbabilityWetYearAnnual(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="incAvgLengthDrySpellAnnual">dLd:</label>
                            <input
                              type="number"
                              id="incAvgLengthDrySpellAnnual"
                              className="form-control mb-2"
                              placeholder="dLd"
                              required
                              style={inputStyle}
                              value={incAvgLengthDrySpellAnnual}
                              onChange={(event) => {
                                setIncAvgLengthDrySpellAnnual(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="profitMultiplierGoodBadYear">rhoR:</label>
                            <input
                              type="number"
                              id="profitMultiplierGoodBadYear"
                              className="form-control mb-2"
                              placeholder="rhoR"
                              required
                              style={inputStyle}
                              value={profitMultiplierGoodBadYear}
                              min="1.0000001"
                              onChange={(event) => {
                                setProfitMultiplierGoodBadYear(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="ratioReturnsRainVFallow">rhoRF:</label>
                            <input
                              type="number"
                              id="ratioReturnsRainVFallow"
                              className="form-control mb-2"
                              placeholder="rhoRF"
                              required
                              style={inputStyle}
                              value={ratioReturnsRainVFallow}
                              onChange={(event) => {
                                setRatioReturnsRainVFallow(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="ratioReturnsRainVSurfaceWater">rhoRS:</label>
                            <input
                              type="number"
                              id="ratioReturnsRainVSurfaceWater"
                              className="form-control mb-2"
                              placeholder="rhoRS"
                              required
                              style={inputStyle}
                              value={ratioReturnsRainVSurfaceWater}
                              onChange={(event) => {
                                setRatioReturnsRainVSurfaceWater(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="ratioReturnsRainVGroundWater">rhoRG:</label>
                            <input
                              type="number"
                              id="ratioReturnsRainVGroundWater"
                              className="form-control mb-2"
                              placeholder="rhoRG"
                              required
                              style={inputStyle}
                              value={ratioReturnsRainVGroundWater}
                              onChange={(event) => {
                                setRatioReturnsRainVGroundWater(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="multiplierProfitWaterHighValCrops">aCr:</label>
                            <input
                              type="number"
                              id="multiplierProfitWaterHighValCrops"
                              className="form-control mb-2"
                              placeholder="aCr"
                              required
                              style={inputStyle}
                              value={multiplierProfitWaterHighValCrops}
                              max="0.9999999"
                              onChange={(event) => {
                                setMultiplierProfitWaterHighValCrops(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                        <div className="col-6">
                            <label htmlFor="profitPenaltyPerPersonPubInfo">Pen:</label>
                            <input
                              type="number"
                              id="profitPenaltyPerPersonPubInfo"
                              className="form-control mb-2"
                              placeholder="Pen"
                              required
                              style={inputStyle}
                              value={profitPenaltyPerPersonPubInfo}
                              onChange={(event) => {
                                setProfitPenaltyPerPersonPubInfo(event.target.valueAsNumber)
                              }}
                            ></input>
                        </div>
                    </div>
                    <input className="mt-3" type="checkbox" id="isModerated" value={moderated} onChange={e => setModerated(e.target.checked)} />
                    <label htmlFor="isModerated"> Moderated Game</label>
                    <div className="d-flex flex-row-reverse ">
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={extraButtonStyle}
                            onClick={() => {createMatch(creatingPlayerName)}}
                        >
                          Create Game
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            type="button" 
                            style={extraButtonStyle}
                            onClick={() => setVisible(!visible)}
                        >
                            Advanced
                        </button>
                    </div>
                    <div style={!visible ? collapseHidden : {}}>
                        <div className="card card-body mb-3">
                            <div className="row">
                                <div className="col-4">
                                    <label htmlFor="optimalFieldAllocationSWSelfish">QNS:</label>
                                    <input
                                    type="number"
                                    id="optimalFieldAllocationSWSelfish"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={optimalFieldAllocationSWSelfish}
                                    max={9 - Math.max(optimalFieldAllocationGWSelfishMyopic, optimalFieldAllocationGWSelfishSustainable)}
                                    min={0}
                                    onChange={(event) => {
                                        setOptimalFieldAllocationSWSelfish(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="optimalFieldAllocationSWCommunity">QFS:</label>
                                    <input
                                    type="number"
                                    id="optimalFieldAllocationSWCommunity"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={optimalFieldAllocationSWCommunity}
                                    max={9 - optimalFieldAllocationGWCommunity}
                                    min={optimalFieldAllocationSWSelfish + 1}
                                    onChange={(event) => {
                                        setOptimalFieldAllocationSWCommunity(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="optimalFieldAllocationGWSelfishMyopic">QNG0:</label>
                                    <input
                                    type="number"
                                    id="optimalFieldAllocationGWSelfishMyopic"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={optimalFieldAllocationGWSelfishMyopic}
                                    max={9 - optimalFieldAllocationSWSelfish}
                                    min={optimalFieldAllocationGWSelfishSustainable + 1}
                                    onChange={(event) => {
                                        setOptimalFieldAllocationGWSelfishMyopic(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="optimalFieldAllocationGWSelfishSustainable">QNG:</label>
                                    <input
                                    type="number"
                                    id="optimalFieldAllocationGWSelfishSustainable"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={optimalFieldAllocationGWSelfishSustainable}
                                    max={Math.min(9 - optimalFieldAllocationSWSelfish, optimalFieldAllocationGWSelfishMyopic - 1)}
                                    min={optimalFieldAllocationGWCommunity + 1}
                                    onChange={(event) => {
                                        setOptimalFieldAllocationGWSelfishSustainable(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="optimalFieldAllocationGWCommunity">QFG:</label>
                                    <input
                                    type="number"
                                    id="optimalFieldAllocationGWCommunity"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={optimalFieldAllocationGWCommunity}
                                    max={Math.min(9 - optimalFieldAllocationSWCommunity, optimalFieldAllocationGWSelfishSustainable - 1)}
                                    min={0}
                                    onChange={(event) => {
                                        setOptimalFieldAllocationGWCommunity(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="profitMarginalFieldFallow">aF:</label>
                                    <input
                                    type="number"
                                    id="profitMarginalFieldFallow"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={profitMarginalFieldFallow}
                                    onChange={(event) => {
                                        setProfitMarginalFieldFallow(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="expectedGWRecharge">EPR:</label>
                                    <input
                                    type="number"
                                    id="expectedGWRecharge"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={expectedGWRecharge}
                                    onChange={(event) => {
                                        setExpectedGWRecharge(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="recessionConstant">k:</label>
                                    <input
                                    type="number"
                                    id="recessionConstant"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={recessionConstant}
                                    onChange={(event) => {
                                        setRecessionConstant(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="ratioMaxLossesVExpectedRecharge">lambda:</label>
                                    <input
                                    type="number"
                                    id="ratioMaxLossesVExpectedRecharge"
                                    className="form-control mb-2"
                                    style={inputStyle}
                                    value={ratioMaxLossesVExpectedRecharge}
                                    min="0.0000001"
                                    max="1"
                                    onChange={(event) => {
                                        setRatioMaxLossesVExpectedRecharge(event.target.valueAsNumber)
                                    }}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
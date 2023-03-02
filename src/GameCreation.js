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

export function CreateGame({ gameCreationPassword }) {
    const setGameID = useSetRecoilState(gameIDAtom);
    const setPlayerID = useSetRecoilState(playerIDAtom);
    const setPlayerCredentials = useSetRecoilState(playerCredentialsAtom);
    const setPlayerNameAtom = useSetRecoilState(playerNameAtom);
    const [creatingPlayerName, setCreatingPlayerName] = useState("");
    const [visible, setVisible] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [errorText, setErrorText] = useState([]);
    const [warningText, setWarningText] = useState([]);
    const [idsWithErrors, setIdsWithErrors] = useState([]);
    const [idsWithWarnings, setIdsWithWarnings] = useState([]);
    const [ignoreWarnings, setIgnoreWarnings] = useState(false);

    const [moderated, setModerated] = React.useState(false);
    const [numVillages, setNumVillages] = React.useState("");
    const [numPlayers, setNumPlayers] = React.useState("");
    const [numYears, setNumYears] = React.useState("");
    const [gameLabel, setGameLabel] = React.useState("");
    const [password, setPassword] = React.useState("");
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

    let basicRParameters = [
      {
        id: "probabilityWetYear",
        label: "P",
        value: probabilityWetYear,
        set_function: setProbabilityWetYear
      },
      {
        id: "avgLengthDrySpell",
        label: "Ld",
        value: avgLengthDrySpell,
        set_function: setAvgLengthDrySpell
      },
      {
        id: "incProbabilityWetYearAnnual",
        label: "dP",
        value: incProbabilityWetYearAnnual,
        set_function: setIncProbabilityWetYearAnnual
      },
      {
        id: "incAvgLengthDrySpellAnnual",
        label: "dLd",
        value: incAvgLengthDrySpellAnnual,
        set_function: setIncAvgLengthDrySpellAnnual
      },
      {
        id: "profitMultiplierGoodBadYear",
        label: "rhoR",
        value: profitMultiplierGoodBadYear,
        set_function: setProfitMultiplierGoodBadYear
      },
      {
        id: "ratioReturnsRainVFallow",
        label: "rhoRF",
        value: ratioReturnsRainVFallow,
        set_function: setRatioReturnsRainVFallow
      },
      {
        id: "ratioReturnsRainVSurfaceWater",
        label: "rhoRS",
        value: ratioReturnsRainVSurfaceWater,
        set_function: setRatioReturnsRainVSurfaceWater,
        min: "",
        max: ""
      },
      {
        id: "ratioReturnsRainVGroundWater",
        label: "rhoRG",
        value: ratioReturnsRainVGroundWater,
        set_function: setRatioReturnsRainVGroundWater
      },
      {
        id: "multiplierProfitWaterHighValCrops",
        label: "aCr",
        value: multiplierProfitWaterHighValCrops,
        set_function: setMultiplierProfitWaterHighValCrops
      },
      {
        id: "profitPenaltyPerPersonPubInfo",
        label: "Pen",
        value: profitPenaltyPerPersonPubInfo,
        set_function: setProfitPenaltyPerPersonPubInfo
      },
    ]

    let advancedRParameters = [
      {
        id: "optimalFieldAllocationSWSelfish",
        label: "QNS",
        value: optimalFieldAllocationSWSelfish,
        set_function: setOptimalFieldAllocationSWSelfish
      },
      {
        id: "optimalFieldAllocationSWCommunity",
        label: "QFS",
        value: optimalFieldAllocationSWCommunity,
        set_function: setOptimalFieldAllocationSWCommunity
      },
      {
        id: "optimalFieldAllocationGWSelfishMyopic",
        label: "QNG0",
        value: optimalFieldAllocationGWSelfishMyopic,
        set_function: setOptimalFieldAllocationGWSelfishMyopic
      },
      {
        id: "optimalFieldAllocationGWSelfishSustainable",
        label: "QNG",
        value: optimalFieldAllocationGWSelfishSustainable,
        set_function: setOptimalFieldAllocationGWSelfishSustainable
      },
      {
        id: "optimalFieldAllocationGWCommunity",
        label: "QFG",
        value: optimalFieldAllocationGWCommunity,
        set_function: setOptimalFieldAllocationGWCommunity
      },
      {
        id: "profitMarginalFieldFallow",
        label: "aF",
        value: profitMarginalFieldFallow,
        set_function: setProfitMarginalFieldFallow
      },
      {
        id: "expectedGWRecharge",
        label: "EPR",
        value: expectedGWRecharge,
        set_function: setExpectedGWRecharge
      },
      {
        id: "recessionConstant",
        label: "k",
        value: recessionConstant,
        set_function: setRecessionConstant
      },
      {
        id: "ratioMaxLossesVExpectedRecharge",
        label: "lambda",
        value: ratioMaxLossesVExpectedRecharge,
        set_function: setRatioMaxLossesVExpectedRecharge
      }
    ]

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

    function resetErrorsWarnings() {
      setShowError(false);
      setShowWarning(false);
      setErrorText([]);
      setWarningText([]);
      setIdsWithErrors([]);
      setIdsWithWarnings([]);
    }

    function checkEntries(P, dP, Ld, dLd, QFS, QNS, QFG, QNG, QNG0, k, rhoRS, rhoRG, rhoRF, lambda, rhoR, aCr, playerName, password) {
      resetErrorsWarnings();
      console.log(gameCreationPassword)
      let error = submissionErrors(QFS, QNS, QFG, QNG, QNG0, k, lambda, rhoR, aCr, password);
      let warning = submissionWarnings(P, dP, Ld, dLd, rhoRS, rhoRG, rhoRF, QNG);

      if (error.text.length == 0 && (warning.text.length == 0 || ignoreWarnings)) {
        createMatch(playerName);
      } else {
        if (error.text.length > 0) {
          setShowError(true);
          setErrorText(error.text);
          setIdsWithErrors(error.ids);
        }

        if (warning.text.length > 0 && !ignoreWarnings) {
          setShowWarning(true);
          setWarningText(warning.text);
          setIdsWithWarnings(warning.ids);
        }
      }
    }

    function ignore() {
      setIgnoreWarnings(true);
      setIdsWithWarnings([]);
      setWarningText([]);
      setShowWarning(false);
    }

    function getValidState(id) {
      if (idsWithErrors.includes(id)) {
        return "form-control is-invalid mb-2";
      } else if (idsWithWarnings.includes(id)) {
        return "form-control is-warning mb-2";
      } else {
        return "form-control mb-2";
      }
    }

    function submissionErrors(QFS, QNS, QFG, QNG, QNG0, k, lambda, rhoR, aCr, password) {
        let errorText = [];
        let errorIds = [];

        if (password !== gameCreationPassword) {
          errorText.push("Password entered is invalid!");
          errorIds.push("password")
        }
        if(QNS+QNG > 9) {
          errorText.push(`QNS + QNG (${QNS+QNG}) must be less than or equal to 9!`);
          errorIds.push(...["optimalFieldAllocationSWSelfish", "optimalFieldAllocationGWSelfishSustainable"])
        }
        if(QNS+QNG0 > 9) {
          errorText.push(`QNS + QNG0 (${QNS+QNG0}) must be less than or equal to 9!`);
          errorIds.push(...["optimalFieldAllocationSWSelfish", "optimalFieldAllocationGWSelfishMyopic"])
        }
        if(QFS+QFG > 9) {
          errorText.push(`QFS + QFG (${QFS+QFG}) must be less than or equal to 9!`);
          errorIds.push(...["optimalFieldAllocationSWCommunity", "optimalFieldAllocationGWCommunity"])
        }
        if(QFS > QNS) {
          errorText.push(`QFS (${QFS}) must be smaller than QNS (${QNS})!`);
          errorIds.push(...["optimalFieldAllocationSWCommunity", "optimalFieldAllocationSWSelfish"])
        }
        if(QNG > QNG0) {
          errorText.push(`QNG (${QNG}) must be smaller than QNG0 (${QNG0})!`);
          errorIds.push(...["optimalFieldAllocationGWSelfishSustainable", "optimalFieldAllocationGWSelfishMyopic"])
        }
        if(QFG > QNG) {
          errorText.push(`QFG (${QFG}) must be smaller than QNG (${QNG})!`);
          errorIds.push(...["optimalFieldAllocationGWCommunity", "optimalFieldAllocationGWSelfishSustainable"])
        }
        if (QFS <= QNS/2) {
            errorText.push(`QFS must be greater than half the value of QNS (${QNS/2})!`);
            errorIds.push(...["optimalFieldAllocationSWCommunity", "optimalFieldAllocationSWSelfish"])
        }
        if (QFG <= QNG/2) {
            errorText.push(`QFG must be greater than half the value of QNG (${QNG/2})!`);
            errorIds.push(...["optimalFieldAllocationGWCommunity", "optimalFieldAllocationGWSelfishSustainable"])
        }
        if (QNG*(k+1) <= QNG0) {
            errorText.push(`QNG0 must be less than QNG*(k+1) (${QNG*(k+1)})!`); 
            errorIds.push(...["optimalFieldAllocationGWSelfishSustainable", "optimalFieldAllocationGWSelfishMyopic", "recessionConstant"]) 
        }
        if(lambda<0 | lambda>=1) {
          errorText.push("lambda must be between 0 and 1!");
          errorIds.push("ratioMaxLossesVExpectedRecharge")  
        }
        if(rhoR>1) {
          errorText.push("rhoR must be lesss than 1!"); 
          errorIds.push("profitMultiplierGoodBadYear") 
        }
        if(aCr<1) {
          errorText.push("aCr must be greater than 1!");
          errorIds.push("multiplierProfitWaterHighValCrops")  
        }

        let uniqueErrorIds = errorIds.filter((id, pos) => {
          return errorIds.indexOf(id) == pos; 
        });

        return {text: errorText, ids: uniqueErrorIds};
    }

    function submissionWarnings(P, dP, Ld, dLd, rhoRS, rhoRG, rhoRF, QNG) {
        let warningText = [];
        let warningIds = [];

        if (rhoRS >= 1) {
          warningText.push("rhoRS should be less than 1!");
          warningIds.push("ratioReturnsRainVSurfaceWater"); 
        }
        if (rhoRG >= 1) {
          warningText.push("rhoRG should be less than 1!");
          warningIds.push("ratioReturnsRainVGroundWater");
        }
        if (rhoRS < rhoRG) {
          warningText.push("rhoRS should be greater than rhoRG!");
          warningIds.push(...["ratioReturnsRainVSurfaceWater", "ratioReturnsRainVGroundWater"]);
        }
        if (rhoRF <= 1 || rhoRF >= 1.5) {
          warningText.push("rhoRF should be between 1 and 1.5!");
          warningIds.push("ratioReturnsRainVFallow");
        }
        if (QNG == 4) {
          warningText.push("QNG should not equal 4 or SW profits will become negative before GW!");
          warningIds.push("optimalFieldAllocationGWSelfishSustainable");
        }
        if(dP > (1-P)/10 || dP < -(1-P)/10) {
          warningText.push(`dP should be between ${-(1-P)/10} and ${(1-P)/10}!`);
          warningIds.push(...["probabilityWetYear", "incProbabilityWetYearAnnual"]);  
        }
        if(Ld >= 5) {
          warningText.push("Ld should be less than 5!");
          warningIds.push("avgLengthDrySpell");   
        }
        if(dLd < (5-Ld)/3) {
          warningText.push(`dLd should be greater than ${(5-Ld)/3}!`);
          warningIds.push(...["avgLengthDrySpell", "incAvgLengthDrySpellAnnual"]);   
        }

        let uniqueWarningIds = warningIds.filter((id, pos) => {
          return warningIds.indexOf(id) == pos; 
        });

        return {text: warningText, ids: uniqueWarningIds};
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
                    {basicRParameters.map(input => (
                      <div className="col-6">
                        <label htmlFor={input.id}>{input.label}:</label>
                        <input
                          type="number"
                          id={input.id}
                          className={getValidState(input.id)}
                          placeholder={input.label}
                          required
                          style={inputStyle}
                          value={input.value}
                          onChange={(event) => {
                            input.set_function(event.target.valueAsNumber)
                          }}
                        ></input>
                      </div>
                    ))}
                  </div>
                  <input
                    type="password"
                    id="password"
                    className={getValidState("password")}
                    placeholder="Enter Password"
                    style={inputStyle}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                    }}
                  ></input>
                  <input className="mt-3" type="checkbox" id="isModerated" value={moderated} onChange={e => setModerated(e.target.checked)} />
                  <label htmlFor="isModerated"> Moderated Game</label>
                  <div className="d-flex flex-row-reverse ">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={extraButtonStyle}
                      onClick={() => {
                        checkEntries(
                          probabilityWetYear,
                          incProbabilityWetYearAnnual,
                          avgLengthDrySpell,
                          incAvgLengthDrySpellAnnual,
                          optimalFieldAllocationSWCommunity, 
                          optimalFieldAllocationSWSelfish, 
                          optimalFieldAllocationGWCommunity, 
                          optimalFieldAllocationGWSelfishSustainable, 
                          optimalFieldAllocationGWSelfishMyopic, 
                          recessionConstant, 
                          ratioReturnsRainVSurfaceWater, 
                          ratioReturnsRainVGroundWater, 
                          ratioReturnsRainVFallow,
                          ratioMaxLossesVExpectedRecharge,
                          profitMultiplierGoodBadYear,
                          multiplierProfitWaterHighValCrops,
                          creatingPlayerName,
                          password
                        )
                      }}
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
                        {advancedRParameters.map(input => (
                          <div className="col-4">
                            <label htmlFor={input.id}>{input.label}:</label>
                            <input
                            type="number"
                            id={input.id}
                            className={getValidState(input.id)}
                            style={inputStyle}
                            value={input.value}
                            onChange={(event) => {
                                input.set_function(event.target.valueAsNumber)
                            }}
                            ></input>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  { (showError) &&
                    <div className="mb-4">
                      <span className="mb-3">Errors: Must correct to continue!</span>
                      {errorText.map(error => (
                        <div className="alert alert-danger mb-2" role="alert">
                          {error}
                        </div>
                      ))}
                    </div>
                  }
                  { (showWarning) &&
                    <div className="mt-4">
                      <span className="mb-3">Warnings: Correct or click below to dismiss.</span>
                      {warningText.map(warning => (
                        <div className="alert alert-warning mb-2" role="alert">
                          {warning}
                        </div>
                      ))}
                      <button 
                        className="btn btn-primary" 
                        type="button" 
                        style={extraButtonStyle}
                        onClick={() => ignore()}
                      >
                        Ignore
                      </button>
                    </div>
                  }
                </div>
            </div>
        </div>
    );
}
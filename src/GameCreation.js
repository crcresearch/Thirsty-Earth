import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LobbyClient } from "boardgame.io/client";
import { useSetRecoilState } from "recoil";

import { gameIDAtom } from "./atoms/gameid";
import { playerIDAtom } from "./atoms/pid";
import { playerCredentialsAtom } from "./atoms/playercred";
import { playerNameAtom } from "./atoms/playername";

import axios from 'axios'
import { API_URL } from "./config";
import { GAME_NAME } from "./config";
import { PLUMBER_URL } from "./config";

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

const linkStyle = {
  textDecoration: "none"
};

const lobbyClient = new LobbyClient({ server: API_URL });

export function CreateGame() {
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

    const [moderated, setModerated] = React.useState(true);
    const [numVillages, setNumVillages] = React.useState(null);
    const [numPlayers, setNumPlayers] = React.useState(null);
    const [numYears, setNumYears] = React.useState(null);
    const [gameLabel, setGameLabel] = React.useState("");
    const [imgSrc, setImgSrc] = React.useState("");
    const [showGraphModal, setShowGraphModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    // R parameters (basic)
    const [probabilityWetYear, setProbabilityWetYear] = React.useState(0.5); // P
    const [avgLengthDrySpell, setAvgLengthDrySpell] = React.useState(1.25); // Ld
    const [incProbabilityWetYearAnnual, setIncProbabilityWetYearAnnual] = React.useState(0); // dP
    const [incAvgLengthDrySpellAnnual, setIncAvgLengthDrySpellAnnual] = React.useState(0); // dLd
    const [ratioReturnsRainVSurfaceWater, setRatioReturnsRainVSurfaceWater] = React.useState(0.1); // rhoRS
    const [ratioReturnsRainVGroundWater, setRatioReturnsRainVGroundWater] = React.useState(0.06); // rhoRG
    const [profitMultiplierGoodBadYear, setProfitMultiplierGoodBadYear] = React.useState(0.15); // rhoR
    const [groundwaterRechargeGoodBadYear, setGroundwaterRechargeGoodBadYear] = React.useState(0.8); // rhoRe
    const [ratioReturnsRainVFallow, setRatioReturnsRainVFallow] = React.useState(1.2); // rhoRF
    const [multiplierProfitWaterHighValCrops, setMultiplierProfitWaterHighValCrops] = React.useState(2); // aCr
    const [profitPenaltyPerPersonPubInfo, setProfitPenaltyPerPersonPubInfo] = React.useState(0.5); // aPen
    // R parameters (advanced)
    const [optimalFieldAllocationSWSelfish, setOptimalFieldAllocationSWSelfish] = React.useState(4); // QNS
    const [optimalFieldAllocationSWCommunity, setOptimalFieldAllocationSWCommunity] = React.useState(3); // QFS
    const [optimalFieldAllocationGWSelfishMyopic, setOptimalFieldAllocationGWSelfishMyopic] = React.useState(5); // QNG0
    const [optimalFieldAllocationGWSelfishSustainable, setOptimalFieldAllocationGWSelfishSustainable] = React.useState(3); // QNG
    const [optimalFieldAllocationGWCommunity, setOptimalFieldAllocationGWCommunity] = React.useState(2); // QFG
    const [profitMarginalFieldFallow, setProfitMarginalFieldFallow] = React.useState(1); // aF
    const [expectedGWRecharge, setExpectedGWRecharge] = React.useState(3); // EPR
    const [recessionConstant, setRecessionConstant] = React.useState(1.75); // k
    const [ratioMaxLossesVExpectedRecharge, setRatioMaxLossesVExpectedRecharge] = React.useState(0.9); // lambda

    // Add state for disabled options
    const [disableRiver, setDisableRiver] = React.useState(false);
    const [disableWell, setDisableWell] = React.useState(false);
    const [disableEmptyCrop, setDisableEmptyCrop] = React.useState(false);
    const [disableHighCrop, setDisableHighCrop] = React.useState(false);

    // const [turnTimer, setTurnTimer] = React.useState(null);

    let basicRParameters = [
      {
        id: "probabilityWetYear",
        label: "Probability of good rain year (P)",
        value: probabilityWetYear,
        set_function: setProbabilityWetYear
      },
      {
        id: "avgLengthDrySpell",
        label: "Average length of dry spell (Ld)",
        value: avgLengthDrySpell,
        set_function: setAvgLengthDrySpell
      },
      {
        id: "incProbabilityWetYearAnnual",
        label: "Annual increase in P (dP)",
        value: incProbabilityWetYearAnnual,
        set_function: setIncProbabilityWetYearAnnual
      },
      {
        id: "incAvgLengthDrySpellAnnual",
        label: "Annual increase in Ld (dLd)",
        value: incAvgLengthDrySpellAnnual,
        set_function: setIncAvgLengthDrySpellAnnual
      },
      {
        id: "profitMultiplierGoodBadYear",
        label: "Ratio of rainfed profits in a bad vs. good rain year (rhoR)",
        value: profitMultiplierGoodBadYear,
        set_function: setProfitMultiplierGoodBadYear
      },
      {
        id: "groundwaterRechargeGoodBadYear",
        label: "Groundwater recharge for a good vs bad year (rhoRe)",
        value: groundwaterRechargeGoodBadYear,
        set_function: setGroundwaterRechargeGoodBadYear
      },
      {
        id: "ratioReturnsRainVFallow",
        label: "Ratio of utilities for rainfed crops and outside wages (rhoRF)",
        value: ratioReturnsRainVFallow,
        set_function: setRatioReturnsRainVFallow
      },
      {
        id: "ratioReturnsRainVSurfaceWater",
        label: "Ratio of utilities for rainfed crops and surface water crops (rhoRS)",
        value: ratioReturnsRainVSurfaceWater,
        set_function: setRatioReturnsRainVSurfaceWater,
        min: "",
        max: ""
      },
      {
        id: "ratioReturnsRainVGroundWater",
        label: "Ratio of utilities for rainfed crops and groundwater crops (rhoRG)",
        value: ratioReturnsRainVGroundWater,
        set_function: setRatioReturnsRainVGroundWater
      },
      {
        id: "multiplierProfitWaterHighValCrops",
        label: "High value crop multiplier (aCr)",
        value: multiplierProfitWaterHighValCrops,
        set_function: setMultiplierProfitWaterHighValCrops
      },
      {
        id: "profitPenaltyPerPersonPubInfo",
        label: "Percentage of the profit if all fields were fallow (aPen)",
        value: profitPenaltyPerPersonPubInfo,
        set_function: setProfitPenaltyPerPersonPubInfo
      },
    ]

    let advancedRParameters = [
      {
        id: "optimalFieldAllocationSWSelfish",
        label: "Nash optimal surface water fields (QNS)",
        value: optimalFieldAllocationSWSelfish,
        set_function: setOptimalFieldAllocationSWSelfish
      },
      {
        id: "optimalFieldAllocationSWCommunity",
        label: "First Best optimal surface water fields (QFS)",
        value: optimalFieldAllocationSWCommunity,
        set_function: setOptimalFieldAllocationSWCommunity
      },
      {
        id: "optimalFieldAllocationGWSelfishMyopic",
        label: "Myopic Nash optimal groundwater fields (QNG0)",
        value: optimalFieldAllocationGWSelfishMyopic,
        set_function: setOptimalFieldAllocationGWSelfishMyopic
      },
      {
        id: "optimalFieldAllocationGWSelfishSustainable",
        label: "Sustainable Nash optimal groundwater fields (QNG)",
        value: optimalFieldAllocationGWSelfishSustainable,
        set_function: setOptimalFieldAllocationGWSelfishSustainable
      },
      {
        id: "optimalFieldAllocationGWCommunity",
        label: "Sustainable First Best optimal groundwater fields (QFG)",
        value: optimalFieldAllocationGWCommunity,
        set_function: setOptimalFieldAllocationGWCommunity
      },
      {
        id: "profitMarginalFieldFallow",
        label: "Fallow unit profit (aF)",
        value: profitMarginalFieldFallow,
        set_function: setProfitMarginalFieldFallow
      },
      {
        id: "expectedGWRecharge",
        label: "Expected groundwater recharge (EPR)",
        value: expectedGWRecharge,
        set_function: setExpectedGWRecharge
      },
      {
        id: "recessionConstant",
        label: "Groundwater recession constant (k)",
        value: recessionConstant,
        set_function: setRecessionConstant
      },
      {
        id: "ratioMaxLossesVExpectedRecharge",
        label: "Steady state water level ratio (lambda)",
        value: ratioMaxLossesVExpectedRecharge,
        set_function: setRatioMaxLossesVExpectedRecharge
      }
    ]

    let navigate = useNavigate();

    function createMatch(playerName) {
        lobbyClient
            .createMatch(GAME_NAME, {
                numPlayers: numPlayers * numVillages + 1, 
                setupData: {
                    numYears: numYears, 
                    playersPerVillage: numPlayers, 
                    numVillages: numVillages,
                    probabilityWetYear: probabilityWetYear, // P
                    avgLengthDrySpell: avgLengthDrySpell, // Ld
                    incProbabilityWetYearAnnual: incProbabilityWetYearAnnual, // dP
                    incAvgLengthDrySpellAnnual: incAvgLengthDrySpellAnnual, // dLd
                    profitMultiplierGoodBadYear: profitMultiplierGoodBadYear, // rhoR
                    groundwaterRechargeGoodBadYear: groundwaterRechargeGoodBadYear, // rhoRe
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
                    gameLabel: gameLabel,
                    // Add disabled options
                    disabledOptions: {
                        riverWater: disableRiver,
                        wellWater: disableWell,
                        emptyCrop: disableEmptyCrop,
                        highCrop: disableHighCrop
                    }
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

    function checkEntries(checkFor, P, dP, Ld, dLd, QFS, QNS, QFG, QNG, QNG0, k, rhoRS, rhoRG, rhoRF, lambda, rhoR, aCr, playerName) {
      resetErrorsWarnings();
      let error = submissionErrors(QFS, QNS, QFG, QNG, QNG0, k, lambda, rhoR, aCr);
      let warning = submissionWarnings(P, dP, Ld, dLd, rhoRS, rhoRG, rhoRF, QNG, lambda, k);

      if (error.text.length == 0 && (warning.text.length == 0 || ignoreWarnings)) {
        if (checkFor == "createMatch") {
          createMatch(playerName);
        } else {
          generateGraph()
        }
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

    function submissionErrors(QFS, QNS, QFG, QNG, QNG0, k, lambda, rhoR, aCr) {
        let errorText = [];
        let errorIds = [];

        if (numPlayers < 3) {
          errorText.push("Each village needs at least 3 players.");
          errorIds.push("playersPerVillage")
        }
        if (numPlayers * numVillages + 1 > 100) {
          errorText.push("The number of active players (players per village times number of villages) plus the moderator (1) must be less than or equal to 100.");
          errorIds.push("playersPerVillage", "numVillages")
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
          errorText.push("rhoR must be less than 1!"); 
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

    function submissionWarnings(P, dP, Ld, dLd, rhoRS, rhoRG, rhoRF, QNG, lambda, k) {
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
        if(dLd > (5-Ld)/3) {
          warningText.push(`dLd should be less than or equal to ${(5-Ld)/3}!`);
          warningIds.push(...["avgLengthDrySpell", "incAvgLengthDrySpellAnnual"]);   
        }
        if (lambda<(1/k)) {
          warningText.push(`lambda should be greater than ${1/k}!`);
          warningIds.push(...["ratioMaxLossesVExpectedRecharge", "recessionConstant"]);
        }

        let uniqueWarningIds = warningIds.filter((id, pos) => {
          return warningIds.indexOf(id) == pos; 
        });

        return {text: warningText, ids: uniqueWarningIds};
    }

    function generateGraph() {
      axios.post(`${PLUMBER_URL}/calculate`, null, {params: {
          Water: "0".repeat(9*numPlayers),
          Crop: "0".repeat(9*numPlayers),
          IB: "0000000000000000000000",
          GD: (new Array(numPlayers).fill(0)).join(),
          r0: 1,
          P: probabilityWetYear,
          Ld: avgLengthDrySpell,
          dP: incProbabilityWetYearAnnual,
          dLd: incAvgLengthDrySpellAnnual,
          QNS: optimalFieldAllocationSWSelfish,
          QFS: optimalFieldAllocationSWCommunity,
          QNG0: optimalFieldAllocationGWSelfishMyopic,
          QNG: optimalFieldAllocationGWSelfishSustainable,
          QFG: optimalFieldAllocationGWCommunity,
          rhoRF: ratioReturnsRainVFallow,
          rhoRS: ratioReturnsRainVSurfaceWater,
          rhoRG: ratioReturnsRainVGroundWater,
          rhoR: profitMultiplierGoodBadYear,
          rhoRe: groundwaterRechargeGoodBadYear,
          aF: profitMarginalFieldFallow,
          EPR: expectedGWRecharge,
          k: recessionConstant,
          aCr: multiplierProfitWaterHighValCrops,
          lambda: ratioMaxLossesVExpectedRecharge,
          aPen: profitPenaltyPerPersonPubInfo,
          VillageID: 1,
          PlayerIDs: (new Array(numPlayers).fill(0)).join(),
          isHumanPlayer: "1".repeat(numPlayers),
          numPlayers: numPlayers,
          gameLabel: gameLabel,
          generateGraph: true
      }}).then((res) => {
        setImgSrc(res.data[0][0])
        setShowGraphModal(true)
      })
    }

    return (
        <div className="container mt-4">
          {showGraphModal &&
            <div class="modal modal-show" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Optimal Profits Graph</h5>
                        </div>
                        <div class="modal-body">
                            <p>Here is a graph of the optimal profits for this game configuration:</p>
                            <img className="img-fluid" src={`${process.env.PUBLIC_URL}/${imgSrc}`}></img>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onClick={() => {
                                setShowGraphModal(false)
                            }}>Exit</button>
                        </div>
                    </div>
                </div>
            </div>
            }
            {showFeedbackModal &&
            <div class="modal modal-show" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Feedback Form</h5>
                        </div>
                        <div class="modal-body">
                          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc0mJV56sOstsghoc7PAnAItWyrBSIg0cZmvhMS-Nz-tVjZrQ/viewform?embedded=true" width="100%" height="766" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onClick={() => {
                                setShowFeedbackModal(false)
                            }}>Exit</button>
                        </div>
                    </div>
                </div>
            </div>
            }
            <nav className="navbar">
                <a className="navbar-brand" target="_blank" href="https://drive.google.com/drive/u/0/folders/14b00jvGWzQ-elFGk8LrtbPAg4ak5VFvy">
                  Instructor Documents
                </a>
                <a onClick={() => { setShowFeedbackModal(true) }} className="btn btn-navy my-2 my-sm-0">
                  Submit Feedback
                </a>
            </nav>
            <h2 className="text-center mb-4"><a className="title-font" style={linkStyle} href="/">Thirsty Earth Lobby</a></h2>
            <div className="row">
                <div className="col-6 offset-lg-3">
                  <h2 className="subtitle-font text-center">Create Game</h2>
                  <div>
                    <label htmlFor="name">Your Name:</label>
                    <input
                      type="text"
                      id="name"
                      className="form-control mb-2"
                      required
                      style={inputStyle}
                      value={creatingPlayerName}
                      onChange={(event) => {
                        setCreatingPlayerName(event.target.value)
                      }}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="numVillages">Number of Villages:</label>
                    <input
                      type="number"
                      id="numVillages"
                      className={getValidState("numVillages")}
                      required
                      style={inputStyle}
                      value={numVillages}
                      onChange={(event) => {
                        setNumVillages(event.target.valueAsNumber)
                      }}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="playersPerVillage">Players Per Village:</label>
                    <input
                      type="number"
                      id="playersPerVillage"
                      className={getValidState("playersPerVillage")}
                      style={inputStyle}
                      value={numPlayers}
                      onChange={(event) => {
                        setNumPlayers(event.target.valueAsNumber)
                      }}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="numYears">Number Of Years:</label>
                    <input
                      type="number"
                      id="numYears"
                      className="form-control mb-2"
                      required
                      style={inputStyle}
                      value={numYears}
                      onChange={(event) => {
                        setNumYears(event.target.valueAsNumber)
                      }}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="gameLabel">My Game Nickname:</label>
                    <input
                      type="text"
                      id="gameLabel"
                      className="form-control mb-2"
                      style={inputStyle}
                      value={gameLabel}
                      onChange={(event) => {
                        setGameLabel(event.target.value)
                      }}
                    ></input>
                  </div>
                  <div className="row">
                    {basicRParameters.map(input => (
                      <div>
                        <label htmlFor={input.id}>{input.label}:</label>
                        <input
                          type="number"
                          id={input.id}
                          className={getValidState(input.id)}
                          step="0.1"
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

                  <div className="card my-4 p-3">
                    <h5>Disable Water/Crop Choices</h5>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="disableRiver"
                            checked={disableRiver}
                            onChange={(e) => setDisableRiver(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="disableRiver">
                            Disable Surface Water
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="disableWell"
                            checked={disableWell}
                            onChange={(e) => setDisableWell(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="disableWell">
                            Disable Ground Water
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="disableEmptyCrop"
                            checked={disableEmptyCrop}
                            onChange={(e) => setDisableEmptyCrop(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="disableEmptyCrop">
                            Disable Empty Crop Yield
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="disableHighCrop"
                            checked={disableHighCrop}
                            onChange={(e) => setDisableHighCrop(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="disableHighCrop">
                            Disable High Crop Yield
                        </label>
                    </div>
                  </div>

                  <div className="d-flex flex-row-reverse">
                    <button 
                      className="btn btn-navy" 
                      type="button"
                      disabled={!numPlayers || !numVillages || gameLabel == ""}
                      style={extraButtonStyle}
                      onClick={() => 
                        checkEntries(
                          "generateGraph",
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
                          creatingPlayerName
                        )
                      }
                    >
                      Generate Graph
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={extraButtonStyle}
                      onClick={() => {
                        checkEntries(
                          "createMatch",
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
                          creatingPlayerName
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
                          <div>
                            <label htmlFor={input.id}>{input.label}:</label>
                            <input
                            type="number"
                            id={input.id}
                            className={getValidState(input.id)}
                            step="0.1"
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
import React from "react";
import { useState } from "react";

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

export function CreateJson() {
    const [creatingPlayerName, setCreatingPlayerName] = useState("");
    const [visible, setVisible] = useState(false);

    const [moderated, setModerated] = React.useState(true);
    const [numVillages, setNumVillages] = React.useState(null);
    const [numPlayers, setNumPlayers] = React.useState(null);
    const [numYears, setNumYears] = React.useState(null);
    const [gameLabel, setGameLabel] = React.useState(null);
    const [fileName, setFileName] = React.useState(null);
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

    function createJson(playerName) {
        const setupData = {
            numVillages: numVillages,
            numPlayers: numPlayers, 
            numYears: numYears, 
            gameLabel: gameLabel,
            creatingPlayerName: creatingPlayerName,
            moderated: moderated, 
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
        }
        const json = JSON.stringify(setupData);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }

    function allFilled() {
      const paramsToCheck = [
        numVillages,
        numYears, 
        gameLabel,
        numPlayers, 
        creatingPlayerName,
        moderated, 
        probabilityWetYear,
        avgLengthDrySpell,
        incProbabilityWetYearAnnual,
        incAvgLengthDrySpellAnnual,
        profitMultiplierGoodBadYear,
        groundwaterRechargeGoodBadYear,
        ratioReturnsRainVFallow,
        ratioReturnsRainVSurfaceWater,
        ratioReturnsRainVGroundWater,
        multiplierProfitWaterHighValCrops,
        profitPenaltyPerPersonPubInfo,
        optimalFieldAllocationSWSelfish,
        optimalFieldAllocationSWCommunity,
        optimalFieldAllocationGWSelfishMyopic,
        optimalFieldAllocationGWSelfishSustainable,
        optimalFieldAllocationGWCommunity,
        profitMarginalFieldFallow,
        expectedGWRecharge,
        recessionConstant,
        ratioMaxLossesVExpectedRecharge,
      ]

      let allFilled = true;
      paramsToCheck.forEach((el) => {
        if (el == null) {
          allFilled = false;
        };
      })

      return allFilled;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4"><a className="title-font" style={linkStyle} href="/">Thirsty Earth Lobby</a></h2>
            <div className="row">
                <div className="col-6 offset-lg-3">
                <h2 className="subtitle-font text-center">Generate JSON</h2>
                <div>
                    <label htmlFor="name">File Name:</label>
                    <input
                      type="text"
                      id="name"
                      className="form-control mb-2"
                      required
                      style={inputStyle}
                      value={fileName}
                      onChange={(event) => {
                        setFileName(event.target.value)
                      }}
                    ></input>
                </div>
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
                      className="form-control mb-2"
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
                      className="form-control mb-2"
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
                          className="form-control mb-2"
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
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={extraButtonStyle}
                      disabled={!allFilled()}
                      onClick={() => {
                        createJson(
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
                      Download JSON
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
                            className="form-control mb-2"
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
        </div>
    );
}
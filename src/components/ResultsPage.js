//Based on the following code: https://github.com/timbrownls20/Demo/blob/master/React/bootstrap-modal/src/components/Modal.jsx

import React from 'react';

const resultsStyle = {
    'height': '950px'
}

const listInfoStyle = {
    'max-height': '95%',
    'overflow-y': 'auto'
}

export function ResultsPage({ G, playerID }) {
    return (
        //If the flag determining whether the modal should be shown is true, show the modal. Else, keep it hidden.
        <div className="col-lg bg-lt-navy border-navy" style={resultsStyle}>
            <div className="row bg-med-navy">
                <h5 className="pt-1 text-center text-light">Game Summary</h5>
            </div>
            <div className="row small text-center fw-bold">
                <div className="col">Rain Profit: {G.yearlyStateRecord.reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_R, 0)}</div>
            </div>
            <div className="row small text-center fw-bold">
                <div className="col">River Profit: {G.yearlyStateRecord.reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_S, 0)}</div>
            </div>
            <div className="row small text-center fw-bold">
                <div className="col">Groundwater Profit: {G.yearlyStateRecord.reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_G, 0)}</div>
            </div>
            <div className="row small text-center fw-bold">
                <div className="col">Total Profit: {G.yearlyStateRecord.reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_Net, 0)}</div>
            </div>
            <div className="row bg-med-navy">
                <h5 className="pt-1 text-center text-light">Previous Rounds</h5>
            </div>
            <div className="row" style={listInfoStyle}>
            { 
                [...Array(G.currentRound)].map((x, idx) => {
                    let year = (idx+1 == G.currentRound) ? G : G.yearlyStateRecord[idx+1]
                    return idx+1 != G.currentRound && (
                        <div className='mb-1'>
                            <p className='mb-0 text-center'><strong>Year {idx+1} {idx+1 == G.currentRound ? " (Current)" : ""}</strong></p>
                            <div class="row row-cols-9">
                                {
                                    [...Array(9)].map((y, index) => {
                                        return (
                                            <div className="col mb-1 mx-0 px-0" key={index}>
                                                <img className="bg-wet-dirt border-0" src={waterChoices[year.playerStats[playerID].playerWaterFields.flat(4)[index]]} width="100%"></img>
                                                <br className="p-0 m-0" />
                                                <img className="bg-dirt border-0" src={cropChoices[year.playerStats[playerID].playerCropFields.flat(4)[index]]} width="100%"></img>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="row small text-center">
                                <div className="col">Rainfall: {year.villageStats[year.playerStats[playerID]["village"]].r0 == 2 ? "Good" : "Bad"}</div>
                            </div>
                            <div className="row row-cols-2 small text-center">
                                <div className="col">P_Net: {year.playerStats[playerID].Profit_Net}</div>
                                <div className="col">P_G: {year.playerStats[playerID].Profit_G}</div>
                            </div>
                            <div className="row row-cols-2 small text-center">
                                <div className="col">P_S: {year.playerStats[playerID].Profit_S}</div>
                                <div className="col">P_F: {year.playerStats[playerID].Profit_F}</div>
                            </div>
                            <div className="row small text-center"><strong>New Values:</strong></div>
                            <div className="row small text-center"><span>Funds: ${year.playerStats[playerID].playerMoney.toFixed(2)}</span></div>
                            <div className="row small text-center"><span>GW Depth: {year.playerStats[playerID].groundwaterDepth}</span></div>

                            <div className="row small text-center"><span>Good Rain Next Yr: {year.villageStats[year.playerStats[playerID]["village"]].r0 == 2 ? 100* year.playerStats[playerID]["Prob. Rain Good_Good"] : 100* year.playerStats[playerID]["Prob. Rain Bad_Good"]}%</span></div>
                            <hr></hr>
                        </div>
                    )
                }
            )}
            </div>
        </div>
    )

};

export default ResultsPage
import React from 'react';


// left-hand side options
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';
import crop_empty from "../img/crop_empty.png";
import water_empty from "../img/water_empty.png";

// top options "toptions", if you will.
import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import apple from '../img/apple.png';

export function PreviousRounds({G, playerID}) {
    const waterChoices = [cloud, river, well]
    const cropChoices = [crop_empty, leaf, apple]
    const prevRoundsStyle = {
        'height': '950px'
    }
    const listInfoStyle = {
        'max-height': '95%',
        'overflow-y': 'auto'
    }
    return(
        <div className="col-lg bg-lt-navy border-navy" style={prevRoundsStyle}>
            <div className="row bg-med-navy">
                <h5 className="pt-1 text-center text-light">Previous Rounds</h5>
            </div>
            {/* <div className="row">
                <div className="col">
                    <h5 className="pt-2 text-center">Hello, welcome to<br/>Thirsty Earth!</h5>
                </div>
            </div> */}
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

                            <div className="row small text-center"><span>Probability of Good Rain Year to Good Rain Year: {100* year.playerStats[playerID]["Prob. Rain Good_Good"]}%</span></div>
                            <div className="row small text-center"><span>Probability of Bad Rain Year to Good Rain Year: {100* year.playerStats[playerID]["Prob. Rain Bad_Good"]}%</span></div>
                            <hr></hr>
                        </div>
                    )
                }
            )}
            </div>
        </div>
    )
}
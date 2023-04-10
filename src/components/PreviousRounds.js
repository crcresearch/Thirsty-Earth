import React from 'react';


// left-hand side options
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';
import crop_empty from "../img/crop_empty.png";
import water_empty from "../img/water_empty.png";

// top options "toptions", if you will.
import crop_low from '../img/crop_one.png';
import briefcase from '../img/briefcase.png';
import crop_high from '../img/crop_two.png';

export function PreviousRounds({G, matchData, playerID}) {
    const waterChoices = [cloud, river, well]
    const cropChoices = [crop_empty, crop_low, crop_high]
    const prevRoundsStyle = {
        'height': '780px'
    }
    const listInfoStyle = {
        'max-height': '95%',
        'overflow-y': 'auto'
    }

    const getPlayerName = (stats, infoBit) => {
        const villagePlayerID = stats[G.playerStats[playerID].village].IBOutput[infoBit][0];
        const villagePlayers = stats[G.playerStats[playerID].village].modelOutput[7][0].split(",");
        const gamePlayerID = villagePlayers[villagePlayerID-1];
        const playerName = matchData[gamePlayerID].name ? matchData[gamePlayerID].name : "BOT"
        return playerName
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
                [...Array(G.currentRound).keys()].reverse().map((x, idx) => {
                    let year = (x+1 == G.currentRound) ? G : G.yearlyStateRecord[x+1]
                    return x+1 != G.currentRound && (
                        <div className='mb-1'>
                            <p className='mb-0 text-center'><strong>Year {x+1} {x+1 == G.currentRound ? " (Current)" : ""}</strong></p>
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
                            <div className="row small text-center"><strong>Rainfall: {year.villageStats[G.playerStats[playerID].village].r0 == 2 ? "Good" : "Bad"}</strong></div>
                            <div className="row small text-center"><strong>Yearly Profit: ${year.playerStats[playerID].Profit_Net.toFixed(2)}</strong></div>
                            <div className="row row-cols-2 small text-center">
                                <div className="col">P<sub>F</sub>: ${year.playerStats[playerID].Profit_F.toFixed(2)}</div>
                                <div className="col">P<sub>R</sub>: ${year.playerStats[playerID].Profit_R.toFixed(2)}</div>
                            </div>
                            <div className="row row-cols-2 small text-center">
                                <div className="col">P<sub>S</sub>: ${year.playerStats[playerID].Profit_S.toFixed(2)}</div>
                                <div className="col">P<sub>G</sub>: ${year.playerStats[playerID].Profit_G.toFixed(2)}</div>
                            </div>
                            <div className="row small text-center"><strong>New Values:</strong></div>
                            <div className="row small text-center"><span>Funds: ${year.playerStats[playerID].playerMoney.toFixed(2)}</span></div>
                            <div className="row small text-center"><span>GW Depth: {year.playerStats[playerID].groundwaterDepth}</span></div>
                            {year.villageStats[G.playerStats[playerID].village].infoSelections.length > 0 &&
                                <div className="row small text-center"><strong>Purchased Information:</strong></div>
                            }
                            <table class="table table-striped table-sm mt-1">
                                <tbody>
                                {Object.keys(year.villageStats[G.playerStats[playerID].village].IBOutput).map((key) => (
                                    <tr>
                                        <td className="small">
                                        {(year.villageStats[G.playerStats[playerID].village].IBOutput[key].length > 1) ? 
                                        <span>{key}: {getPlayerName(year.villageStats, key)}, {year.villageStats[G.playerStats[playerID].village].IBOutput[key][1]}</span>
                                        : <span>{key}: {key.includes("Player") ? getPlayerName(year.villageStats, key) : year.villageStats[G.playerStats[playerID].village].IBOutput[key][0]}</span>
                                        }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <hr></hr>
                        </div>
                    )
                }
            )}
            </div>
        </div>
    )
}
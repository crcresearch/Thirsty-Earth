import React from 'react';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { playerIDAtom } from '../atoms/pid';
import { gameIDAtom } from '../atoms/gameid';

import axios from 'axios'
import { PLUMBER_URL } from "../config";

import { ModeratorChatBox } from './ModeratorChatBox';

// left-hand side options
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';
import crop_empty from "../img/crop_empty.png";

// top options "toptions", if you will.
import crop_low from '../img/crop_one.png';
import crop_high from '../img/crop_two.png';

const tableStyle = {
    width: "16.7%"
}

const hide = {
    visibility: "hidden"
}

const buttonSpacing = {
    marginLeft: "10px"
}

export function Moderator({ ctx, G, moves, matchData, chatMessages}) {
    const [selectedBits, setSelectedBits] =  React.useState(new Array(G.gameConfig.numVillages + 1).fill(""));
    const [informationBits, setInformationBits] =  React.useState(new Array(G.gameConfig.numVillages + 1).fill([]));
    const playerID = useRecoilValue(playerIDAtom);
    const gameID = useRecoilValue(gameIDAtom);
    const waterChoices = [cloud, river, well];
    const cropChoices = [crop_empty, crop_low, crop_high];
    const IBChoices = [  
        {"value": 0, "text": "What is the average number of fields irrigated with groundwater per player this year in our village?"},
        {"value": 1, "text": "What was the average number of fields irrigated with surface water per player this year in our village?"},
        {"value": 2, "text": "What was the average number of fields irrigated with rain per player this year in our village?"},
        {"value": 3, "text": "What was the average number of fields left fallow per player this year in our village?"},
        {"value": 4, "text": "How many high value crops were planted on average per player this year in our village?"},
        {"value": 5, "text": "What is the probability of next year being a good year given this years' rain type?"},
        {"value": 6, "text": "What was the average unit groundwater cost over all players in the village this year?"},
        {"value": 7, "text": "What was the average unit surface water cost over all players in the village this year?"},
        {"value": 8, "text": "What was the average net profit for the village this year?"},
        {"value": 9, "text": "Which player had the highest net profit this year?"},
        {"value": 10, "text": "What was the maximum net profit this year?"},
        {"value": 11, "text": "Which player used the most groundwater this year?"},
        {"value": 12, "text": "What is the maximum amount of groundwater used by a single player this year?"},
        {"value": 13, "text": "Which player used the most surface water this year?"},
        {"value": 14, "text": "What is the maximum amount of surface water used by a single player this year?"},
        {"value": 15, "text": "Randomly show a player's number and groundwater usage."},
        {"value": 16, "text": "Randomly show a player's number and surface water usage."},
        {"value": 17, "text": "Randomly show a player's number and rain water usage."},
        {"value": 18, "text": "Randomly show a player's number and their number of fields left fallow."}
    ]

    function pushSelectedBit(selection, village) {
        let tempSelected = selectedBits;
        tempSelected[village] = selection;
        setSelectedBits(tempSelected);
    }

    function pushVillageIB(selection, village) {
        if (selection != "") {
            let tempIBArray = informationBits;
            tempIBArray[village] = [...tempIBArray[village], selection];
            setInformationBits(tempIBArray);
            moves.setInfoBits(informationBits[village], village);
        }
    }

    function removeInfoBit(bit, village) {
        let tempIBArray = informationBits;
        tempIBArray[village] = tempIBArray[village].filter(el => el !== bit)
        setInformationBits(tempIBArray);
        moves.setInfoBits(informationBits[village], village);
    }

    return (
        <div className='container mt-4'>
            <div className="text-center">
                <h3>Game Overview</h3>
            </div>
            <table className='table table-striped'>
                <thead>
                <td>Villages</td>
                <td>Players Per Village</td>
                <td>Players Joined</td>
                <td>Current Year</td>
                <td>Maximum Years</td>
                <td>Game ID</td>
                <td>Game Link</td>
                </thead>
                <tbody>
                    <tr>
                        <td>{G.gameConfig.numVillages}</td>
                        <td>{G.gameConfig.playersPerVillage}</td>
                        <td>{matchData.filter(player => (player.name != undefined && player.isConnected != undefined && player.isConnected == true)).length}</td>
                        <td>{G.currentRound}</td>
                        <td>{G.gameConfig.numYears}</td>
                        <td>{gameID}</td>
                        <td><a href={`/game/${gameID}`}>/game/{gameID}</a></td>
                    </tr>
                </tbody>
            </table>
            <hr/>
            {ctx.phase == "playerMoves" &&
            <div className="my-2">
                <span>Players Submitted: {G.playerStats.filter(stat => stat.selectionsSubmitted == true).length}/{matchData.filter(player => ((!G.gameConfig.moderated || player.id != 0 ) && player.name != undefined && player.isConnected != undefined && player.isConnected == true)).length}</span>
            </div>
            }
            <div className="text-center">
                <h3>Players</h3>
            </div>
            {(matchData.filter(el => G.playerStats[el.id].village === "unassigned").length > 0 && ctx.phase == "setup") &&
                <div>
                    <span className="h5 mt-3 mb-2">Unassigned Players</span>
                    <table className='table table-striped mb-3'>
                        <thead>
                            <td>Player ID</td>
                            <td>Player Name</td>
                            <td>Is Connected</td>
                            <td>Assign Village</td>
                        </thead>
                        <tbody>
                            {matchData.filter(el => G.playerStats[el.id].village === "unassigned").map(player => (
                                <tr key={player.id}>
                                    <td className="align-middle" style={tableStyle}>{player.id}</td>
                                    <td className="align-middle" style={tableStyle}>{player.name ? player.name : ""}</td>
                                    <td className="align-middle" style={tableStyle}>{player.isConnected ? player.isConnected.toString() : ""}</td>
                                    <td className="align-middle" style={tableStyle}>
                                        <select id={`select-${player.id}`} name="village" class="form-select" onChange={(event) => moves.setVillageAssignment(event.target.value, player.id)}>
                                            <option disabled selected>Select an option from the dropdown list</option>
                                            {G.villages.filter(el => el !== 0).map(village => (
                                                <option disabled={matchData.filter(el => G.playerStats[el.id].village === village).length == G.gameConfig.playersPerVillage} key={village} value={village}>Village {village}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            {G.villages.map(village => (
                <div>
                    {(village > 0) &&
                    <div className="row mt-3 mb-2">
                        <div className='col-4'>
                            <span className="h5">Village {village}</span>
                        </div>
                        {(ctx.phase == "setup") &&
                        <div className='col-8'>
                            <div class="input-group">
                                <select className="form-select" id={`select-information-${village}`} name="selectedBits" 
                                onChange={(event) => pushSelectedBit(event.target.value, village)}>
                                    <option disabled selected>Select Information Bit to purchase.</option>
                                    {IBChoices.map(choice => (
                                        <option 
                                            disabled={informationBits[village].includes(choice.value.toString())} 
                                            value={choice.value}>{choice.text}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    className="btn btn-primary" type="submit"
                                    id={`submit-ib-${village}`}
                                    onClick={() => pushVillageIB(selectedBits[village], village)}
                                    disabled={informationBits[village].length >= 6}
                                >
                                    Add Information Bit
                                </button>
                            </div>
                        </div>
                        }
                        {G.villageStats[village].infoSelections.length > 0 &&
                        <table className='table table-striped mt-2'>
                            <thead>
                                <th>Purchased Information</th>
                            </thead>
                            <tbody>
                                {G.villageStats[village].infoSelections.map(bitIndex => (
                                    <tr>
                                        <td>
                                            <span class="mr-3">{IBChoices[bitIndex].text}</span> 
                                        </td>
                                        {(ctx.phase == "setup") &&
                                        <td>
                                            <button 
                                                className="btn btn-outline-danger btn-sm" type="submit"
                                                onClick={() => removeInfoBit(bitIndex, village)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        }
                    </div>
                    }
                    <table className='table table-striped mb-3'>
                        { (village === 0) &&
                            <thead>
                                <td>Player ID</td>
                                <td>Player Name</td>
                                <td>Is Connected</td>
                                <td>Funds</td>
                                <td>Turn Submitted</td>
                                {ctx.phase == "setup" &&
                                    <td>Change Assignment</td>
                                }
                            </thead>
                        }
                        <tbody>
                            {matchData.filter(el => G.playerStats[el.id].village === village).map(player => (
                                <tr key={player.id}>
                                    <td className="align-middle" style={tableStyle}>{player.id} { (village === 0) && "(Moderator)" }</td>
                                    <td className="align-middle" style={tableStyle}>{player.name ? player.name : ""}</td>
                                    <td className="align-middle" style={tableStyle}>{player.isConnected ? player.isConnected.toString() : ""}</td>
                                    <td className="align-middle" style={tableStyle}>{G.playerStats[player.id].playerMoney.toFixed(2)}</td>
                                    <td onClick={() => moves.resetSubmissions(player.id)} className="align-middle" style={tableStyle}>{G.playerStats[player.id].selectionsSubmitted ? <div style={{cursor:"not-allowed"}}> {G.playerStats[player.id].playerWaterFields.flat(4).map((choice, index) => (<img className="bg-wet-dirt border-0" key={index} src={waterChoices[choice]} width="25px"></img>))}<br className="p-0 m-0"/>{G.playerStats[player.id].playerCropFields.flat(4).map((choice, index) => (<img className="bg-dirt border-0" key={index} src={cropChoices[choice]} width="25px"></img>))}</div> : "No"} </td>
                                    {ctx.phase == "setup" &&
                                        <td className="align-middle" style={tableStyle}>
                                        <select style={(player.id === 0) ? hide : {}} id={`select-${player.id}`} name="village" class="form-select" onChange={(event) => moves.setVillageAssignment(event.target.value, player.id)}>
                                            <option disabled selected>Select option...</option>
                                            {G.villages.filter(el => el !== 0 && el !== G.playerStats[player.id].village).map(village => (
                                                <option disabled={matchData.filter(el => G.playerStats[el.id].village === village).length == G.gameConfig.playersPerVillage} key={village} value={village}>Village {village}</option>
                                            ))}
                                            <option value="unassigned">Unassign</option>
                                        </select>
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <hr/>
            <div className="text-left">
                <h3>Actions for Game State: {ctx.phase}</h3>
                {ctx.phase == "setup" && 
                <div>
                <button className='btn btn-primary' onClick={() => 
                axios.post(`${PLUMBER_URL}/calculate`, null, {params: {
                    Water: "000000000000000000000000000000000000000000000000000000",
                    Crop: "000000000000000000000000000000000000000000000000000000",
                    IB: "0000000000000000000",
                    GD: "0,0,0,0,0,0",
                    r0: G.villageStats[1].r0,
                    P: G.gameConfig.probabilityWetYear,
                    Ld: G.gameConfig.avgLengthDrySpell,
                    dP: G.gameConfig.incProbabilityWetYearAnnual,
                    dLd: G.gameConfig.incAvgLengthDrySpellAnnual,
                    QNS: G.gameConfig.optimalFieldAllocationSWSelfish,
                    QFS: G.gameConfig.optimalFieldAllocationSWCommunity,
                    QNG0: G.gameConfig.optimalFieldAllocationGWSelfishMyopic,
                    QNG: G.gameConfig.optimalFieldAllocationGWSelfishSustainable,
                    QFG: G.gameConfig.optimalFieldAllocationGWCommunity,
                    rhoRF: G.gameConfig.ratioReturnsRainVFallow,
                    rhoRS: G.gameConfig.ratioReturnsRainVSurfaceWater,
                    rhoRG: G.gameConfig.ratioReturnsRainVGroundWater,
                    rhoR: G.gameConfig.profitMultiplierGoodBadYear,
                    rhoRe: G.gameConfig.groundwaterRechargeGoodBadYear,
                    aF: G.gameConfig.profitMarginalFieldFallow,
                    EPR: G.gameConfig.expectedGWRecharge,
                    k: G.gameConfig.recessionConstant,
                    aCr: G.gameConfig.multiplierProfitWaterHighValCrops,
                    lambda: G.gameConfig.ratioMaxLossesVExpectedRecharge,
                    Pen: G.gameConfig.profitPenaltyPerPersonPubInfo,
                    VillageID:1,
                    PlayerIDs: "0,1,2,3,4,5",
                    numPlayers: 6
                }}).then((res) => {
                    console.log(res.data[1][0])
                    moves.setPublicInfo(res.data[1][0], playerID)
                })}>Get Public Info</button>
                <button 
                    disabled={
                        G.publicInfo === null || 
                        G.playerStats.reduce(
                            (accumulator, currentVal) => currentVal.village === "unassigned" || currentVal.village == 0 ? accumulator : accumulator + 1, 0 
                        ) < (G.gameConfig.playersPerVillage * G.gameConfig.numVillages)
                    } 
                    className='btn btn-primary'
                    style={buttonSpacing}
                    onClick={() => moves.startGame(playerID)}
                >Start Game</button>
                </div>
                }
                {ctx.phase == "playerMoves" && 
                <div>
                <button className='btn btn-primary' onClick={() => {
                    // break up player choices into village groups
                    // make four calls to R code
                    // when each call comes back, save its output
                    // when all calls come back, merge all of the saved outputs into one 


                    let promisesList = []
                    for(let i = 0; i < G.gameConfig.numVillages ; i++) {
                        let waterChoices = ""
                        let cropChoices = ""
                        console.log(PLUMBER_URL)
                        let playerIDs = []
                        let waterDepths = []
                        matchData.map(player => {
                            if( G.playerStats[player.id].village === i+1 ) {
                                playerIDs.push(player.id)
                                waterDepths.push(G.playerStats[player.id].groundwaterDepth)
                                if(player.name != undefined  ) {
                                    G.playerStats[player.id].playerWaterFields.flat(4).map((choice, index) => (waterChoices += String(choice)))
                                    G.playerStats[player.id].playerCropFields.flat(4).map((choice, index) => (cropChoices += String(choice)))
                                }
                                else {
                                    // if no player has ever logged into this player ID, then fill it with optimal values for the entire village.
                                    waterChoices += "111220000" // 4 rainwater, 3 surface water, 2 groundwater, per JIRA ticket TE-12 
                                    cropChoices += "111111100" // 7 low value crops, 2 fallow, per JIRA ticket TE-12 
                                }
                            }
                        });
                        promisesList.push(axios.post(`${PLUMBER_URL}/calculate`, null, {params: {
                            Water: waterChoices,
                            Crop: cropChoices,
                            IB: G.villageStats[i+1].infoBits,
                            GD: waterDepths.join(","),
                            r0: G.villageStats[i+1].r0,
                            P: G.gameConfig.probabilityWetYear,
                            Ld: G.gameConfig.avgLengthDrySpell,
                            dP: G.gameConfig.incProbabilityWetYearAnnual,
                            dLd: G.gameConfig.incAvgLengthDrySpellAnnual,
                            QNS: G.gameConfig.optimalFieldAllocationSWSelfish,
                            QFS: G.gameConfig.optimalFieldAllocationSWCommunity,
                            QNG0: G.gameConfig.optimalFieldAllocationGWSelfishMyopic,
                            QNG: G.gameConfig.optimalFieldAllocationGWSelfishSustainable,
                            QFG: G.gameConfig.optimalFieldAllocationGWCommunity,
                            rhoRF: G.gameConfig.ratioReturnsRainVFallow,
                            rhoRS: G.gameConfig.ratioReturnsRainVSurfaceWater,
                            rhoRG: G.gameConfig.ratioReturnsRainVGroundWater,
                            rhoR: G.gameConfig.profitMultiplierGoodBadYear,
                            rhoRe: G.gameConfig.groundwaterRechargeGoodBadYear,
                            aF: G.gameConfig.profitMarginalFieldFallow,
                            EPR: G.gameConfig.expectedGWRecharge,
                            k: G.gameConfig.recessionConstant,
                            aCr: G.gameConfig.multiplierProfitWaterHighValCrops,
                            lambda: G.gameConfig.ratioMaxLossesVExpectedRecharge,
                            Pen: G.gameConfig.profitPenaltyPerPersonPubInfo,
                            VillageID:i+1,
                            PlayerIDs: playerIDs.join(","),
                            numPlayers: G.gameConfig.playersPerVillage
                        }}).then((res) => {
                            moves.submitVillageDataUpdate(0, res.data)
                        }))
                    }   
                    
                    Promise.all(promisesList).then(() => {
                        moves.advanceYear(0, {})
                    })
                }
                }>End Choice Period of Current Year</button>
                <button 
                className='btn btn-secondary'
                style={buttonSpacing}
                onClick={() => moves.resetSubmissions()}
                >Unlock Choices</button>
                </div>
                }
                {ctx.phase == "moderatorPause" && 
                <div>
                <button className='btn btn-primary mb-2' onClick={() => moves.advanceToPlayerMoves(0)}>Advance to Next Choice Period</button> <br/>
                {[...Array(G.currentRound - 1)].map(function(x, i) {
                 return <><button className='btn btn-primary mb-2' onClick={() => moves.rewind(0,i+1)}>Rewind to Beginning of Year {i+1}</button><br/></>
                })
                 }
                
                {/* <button className='btn btn-primary mb-2' onClick={() => moves.advanceToPlayerMoves(0)}>Rewind to Beginning of Year </button> */}
                </div>
                }
            </div>
            <hr></hr>

            <ModeratorChatBox chatMessages={chatMessages}></ModeratorChatBox>
        </div>
      

    )
}
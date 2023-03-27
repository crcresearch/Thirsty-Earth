import React from 'react';
import { useState, useRef, useEffect } from 'react';

// left-hand side options
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';

// top options "toptions", if you will.
import leaf from '../img/leaf.png';
import apple from '../img/apple.png';

// Empty tile (default for irrigation method)
import crop_empty from "../img/crop_empty.png";

// Various styles used in the component.
const gameBoardStyle = {
    position: 'relative',
    height: '780px'
}
const selectionsStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '5%',
    marginTop: '-15%'
}

const topSelectionsStyle = {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '10%',
    marginLeft: '30%'
}
const cropGridStyle = {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '5%',
    marginTop: '-10%'

}
const cropSquareStyle = {
    borderStyle: 'solid'
}

const imgStyle = {
    width: '100px',
    height: '100px',
} 

const miniTileStyle = {
    width: 'auto',
    height: '50px',
}

const waterChoices = [cloud, river, well]
const cropChoices = [crop_empty, leaf, apple]

export function YearlyReview({ G, ctx, playerID, confirmFunc }) {
    
    let year = G.yearlyStateRecord[G.currentRound-1]
    let playerCropChoices = year.playerStats[playerID].playerCropFields.flat(4)
    let playerWaterChoices = year.playerStats[playerID].playerWaterFields.flat(4)

    const count_water_amounts = (water_enum, crop_enum) => {
        return playerWaterChoices.reduce(
        (accumulator, currentValue, currentIndex) => {
            return currentValue == water_enum ? (playerCropChoices[currentIndex] == crop_enum ? accumulator + 1 : accumulator) : accumulator
        },
        0
    )}
    return (
        <div className="col-lg-7 bg-green border-navy border-start-0 border-end-0 text-light" style={gameBoardStyle}>
            <div className="row justify-content-center mt-4 text-center">
                        <h2 className="text-light mt-2 mb-0 text-uppercase">Year {G.currentRound - 1} Review </h2>
            </div>
            <div className="row justify-content-center mt-4 mb-2 text-center">
                        <h4 className="text-light mt-2 mb-0">Your Choices</h4>
            </div>
            <div class="row row-cols-9 mx-2">
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
            <div class="row mx-2">
            <table class="table table-success table-striped mt-3">
                <thead>
                  <tr>
                    <th scope="col">Crop Source</th>
                    <th scope="col">Low Val</th>
                    <th scope="col">High Val</th>
                    <th scope="col">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Fallow</th>
                    <td>-</td>
                    <td>-</td>
                    <td>{year.playerStats[playerID].Profit_F}</td>
                  </tr>
                  <tr>
                    <th scope="row">Rain</th>
                    <td>{count_water_amounts(0,1)}</td>
                    <td>{count_water_amounts(0,2)}</td>
                    <td>{year.playerStats[playerID].Profit_R}</td>
                  </tr>
                  <tr>
                    <th scope="row">Surface</th>
                    <td>{count_water_amounts(1,1)}</td>
                    <td>{count_water_amounts(1,2)}</td>
                    <td>{year.playerStats[playerID].Profit_S}</td>
                  </tr>
                  <tr>
                    <th scope="row">Ground</th>
                    <td>{count_water_amounts(2,1)}</td>
                    <td>{count_water_amounts(2,2)}</td>
                    <td>{year.playerStats[playerID].Profit_G}</td>
                  </tr>
                </tbody>
            </table>
            </div>
            <div className="row row-cols-3">
            <div className="col col-md-4 mt-3">
                <div className="bg-dirt-bank text-center">
                    <h6 className="text-white-50 mt-1 mb-0">Yearly Profit</h6>
                    <div className="mb-1">{year.playerStats[playerID].Profit_Net}</div>
                </div>
            </div>
            <div className="col col-md-4 mt-3">
                <div className="bg-dirt-bank text-center">
                    <h6 className="text-white-50 mt-1 mb-0">Total Funds</h6>
                    <div className="mb-1">{year.playerStats[playerID].playerMoney.toFixed(2)}</div>
                </div>
            </div>
            <div className="col col-md-4 mt-3">
                <div className="bg-dirt-bank text-center">
                    <h6 className="text-white-50 mt-1 mb-0">Water Depth</h6>
                   <div className="mb-1">{year.playerStats[playerID].groundwaterDepth}</div>
                </div>
            </div>
            </div>
            <div className="row mx-2">
            <table class="table table-success table-striped mt-3">
                <thead>
                  <tr>
                    <th scope="col">Information Bit</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                {Object.keys(year.villageStats[G.playerStats[playerID].village].IBOutput).map((key) => (
                  <tr>
                    <td>{key}</td>
                    <td>{JSON.stringify(year.villageStats[G.playerStats[playerID].village].IBOutput[key])}</td>
                  </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className="col col-md-8 offset-md-2">
            <div className="d-grid mt-4">
            { ctx.phase == "playerMoves" ?
            <button 
                            className="btn btn-danger text-white text-uppercase"
                            onClick={() => confirmFunc()}
                            >
                            <strong>Go to Year {G.currentRound} Choices</strong>
                        </button> : <span className="text-center">Waiting for the moderator to open up choices for year {G.currentRound}</span> }
                        </div></div>

        </div>
    )
}
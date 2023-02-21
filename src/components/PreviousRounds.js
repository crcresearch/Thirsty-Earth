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
    const waterChoices = [water_empty, well, cloud, river]
    const cropChoices = [crop_empty, briefcase, apple, leaf]
    const prevRoundsStyle = {
        'height': '750px'
    }
    const listInfoStyle = {
        'height': '85%',
        'overflow-y': 'auto'
    }
    return(
        <div className="col-lg bg-lt-navy border-navy" style={prevRoundsStyle}>
            <div className="row bg-med-navy">
                <h5 className="pt-1 text-center text-light">Previous Rounds</h5>
            </div>
            <div className="row">
                <div className="col">
                    <h5 className="pt-2 text-center">Hello, welcome to<br/>Thirsty Earth!</h5>
                </div>
            </div>
            <div className="row" style={listInfoStyle}>
            { 
                [...Array(G.currentRound)].map((x, idx) => {
                    let year = (idx+1 == G.currentRound) ? G : G.yearlyStateRecord[idx+1]
                    return (
                        <div className='mb-3'>
                            <p className='mb-0'>Year {idx+1} {idx+1 == G.currentRound ? " (Current)" : ""}</p>
                            <div class="row row-cols-5">
                                {
                                    [...Array(9)].map((y, index) => {
                                        return (
                                            <div className="col mb-1 p-2" key={index}>
                                                <img className="bg-wet-dirt border-0 p-1" src={waterChoices[year.playerStats[playerID].playerWaterFields.flat(4)[index]]} width="40px"></img>
                                                <br className="p-0 m-0" />
                                                <img className="bg-dirt border-0 p-1" src={cropChoices[year.playerStats[playerID].playerCropFields.flat(4)[index]]} width="40px"></img>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            )}
            </div>
        </div>
    )
}
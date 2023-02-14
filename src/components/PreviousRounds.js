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
        height: '800px'
    }
    return(
        <div className="col-lg bg-lt-navy border-navy">
            <div className="row bg-med-navy">
                <h5 className="pt-1 text-center text-light">Previous Rounds</h5>
            </div>
            <div className="row">
                <div className="col">
                    <h5 className="pt-2 text-center">Hello, welcome to<br/>Thirsty Earth!</h5>
                </div>
            </div>
            <div className="row">
            { 
                [...Array(G.currentRound)].map((x, idx) => {
                    let year = (idx+1 == G.currentRound) ? G : G.yearlyStateRecord[idx+1]
                    return (
                        <div className='mb-3'>
                            <p className='mb-0'>Year {idx+1} {idx+1 == G.currentRound ? " (Current)" : ""}</p>
                            <div className="water-summary">
                                {year.playerStats[playerID].playerWaterFields.flat(4).map((choice, index) => (
                                    <img key={index} src={waterChoices[choice]} width="20px"></img>
                                ))}
                            </div>
                            <br/>
                            <div className="crop-summary">
                                {year.playerStats[playerID].playerCropFields.flat(4).map((choice, index) => (
                                    <img key={index} src={cropChoices[choice]} width="20px"></img>
                                ))}
                            </div>
                        </div>
                    )
                }
            )}
            </div>
        </div>
    )
}
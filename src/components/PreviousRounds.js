import React from 'react';


// left-hand side options
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';
import empty_tile from "../img/empty_tile.png";

// top options "toptions", if you will.
import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import apple from '../img/apple.png';

export function PreviousRounds({G, playerID}) {
    const waterChoices = [empty_tile, well, cloud, river]
    const cropChoices = [empty_tile, leaf, apple, briefcase]
    const prevRoundsStyle = {
        height: '800px'
    }
    return(
        <div className="card" style={prevRoundsStyle}>
            <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Previous Rounds</h5>
            </div>
            <div className="card-body">
                <div> Hello, Welcome to Thirsty Earth!</div>
            { 
            [...Array(G.currentRound)].map((x, idx) => {
                let year = (idx+1 == G.currentRound) ? G : G.yearlyStateRecord[idx+1]
                return (<div className='mb-3'><p className='mb-0'>Year {idx+1} {idx+1 == G.currentRound ? " (Current)" : ""}</p><div>{year.playerStats[playerID].playerWaterFields.flat(4).map((choice, index) => (<img key={index} src={waterChoices[choice]} width="20px"></img>))}<br/>{year.playerStats[playerID].playerCropFields.flat(4).map((choice, index) => (<img key={index} src={cropChoices[choice]} width="20px"></img>))}</div></div>)
            }
            
            )}
            </div>
        </div>
    )
}
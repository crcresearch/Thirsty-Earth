import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { playerIDAtom } from '../atoms/pid';

// left-hand side options
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';

// top options "toptions", if you will.
import crop_low from '../img/crop_one.png';
import briefcase from '../img/briefcase.png';
import crop_high from '../img/crop_two.png';

// background image.
import grass from "../img/grass.png";

// Empty tile (default for irrigation method)
import crop_empty from "../img/crop_empty.png";
import water_empty from "../img/water_empty.png";

//reset icon
import reset from "../img/reset_icon.png"

function useStateAndRef(initial) {
    const [value, setValue] = useState(initial);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, setValue, valueRef];
  }

// Various styles used in the component.
const gameBoardStyle = {
    position: 'relative',
    height: '780px'
}

// Add disabled image style
const disabledImageStyle = {
    opacity: 0.5,
    filter: 'grayscale(100%)',
    cursor: 'not-allowed',
    pointerEvents: 'none'
};

// Add clickable style for enabled options
const clickableStyle = {
    cursor: 'pointer'
};

const leftOptions = [
    cloud,
    river,
    well
]

const topOptions = [
    crop_empty,
    crop_low,
    crop_high,
]

// Individual crops on the game board.
const GameTile = ({
    theKey,
    topImage,
    bottomImage,
    topClick,
    bottomClick,
    warning
}) => {
    return(
        <div className="col" key={theKey}>
            <div className="bg-wet-dirt text-center" onClick={topClick} style={{
                    border: warning ? 'solid orange 4px' : undefined,
                    cursor: 'pointer'
                }}>
                <img src={topImage} className="img-fluid"/>
            </div>
            <div className="bg-dirt text-center" onClick={bottomClick} style={{
                    cursor: 'pointer'
                }}>
                <img src={bottomImage} className="img-fluid"/>
            </div>
        </div>
    )
}

// Options able to be selected during gameplay.
const SelectAction = ({
    isHighlighted,
    image,
    altText,
    onClick,
    disabled
}) => {
    return (
        <img 
            src={image} 
            alt={altText} 
            style={{
                border: isHighlighted ? 'solid cyan 2px' : undefined,
                ...(disabled ? disabledImageStyle : clickableStyle)
            }}
            className="img-thumb"
            onClick={disabled ? undefined : onClick}
        />
    )
};

export function MainField({ G, moves, matchData }) {
    // On the gameGrid, the numbers inside the 2D array both provide a key for the crop and a way to set and compare the selected tile.
    const gameGrid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const [gridSelections, setGridSelections] = useState([
        [
            {left: cloud, top: crop_empty},
            {left: cloud, top: crop_empty},
            {left: cloud, top: crop_empty},
        ],
        [
            {left: cloud, top: crop_empty},
            {left: cloud, top: crop_empty},
            {left: cloud, top: crop_empty},
        ],
        [
            {left: cloud, top: crop_empty},
            {left: cloud, top: crop_empty},
            {left: cloud, top: crop_empty},
        ]
    ])
    const [selectedOption, setSelectedOption] = useState({left: '', top: ''});
    const [turnTimeLeft, setTurnTimeLeft] = useState(0);
    const [turnEnd, setTurnEnd, refTurnEnd] = useStateAndRef(0);
    const [gridWarnings, setGridWarnings] = useState([[false, false, false], [false, false, false], [false, false, false]])
    const [showWarning, setShowWarning] = useState(false)
    const playerID = useRecoilValue(playerIDAtom);

    const isOptionDisabled = (option) => {
        if (!G.gameConfig || !G.gameConfig.disabledOptions) return false;
        
        const { riverWater, wellWater, emptyCrop, highCrop } = G.gameConfig.disabledOptions;
        
        switch(option) {
            case river:
                return riverWater;
            case well:
                return wellWater;
            case crop_empty:
                return emptyCrop;
            case crop_high:
                return highCrop;
            default:
                return false;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
          setTurnTimeLeft(refTurnEnd.current != 0 ? Math.floor((refTurnEnd.current - Date.now())/1000) : 0)
        }, 1000);
        return () =>  clearInterval(interval);
      }, []);

    
    // useEffect(() => {
    //     setTurnEnd(G.turnTimeout)
    //     console.log("turn timeout", G.turnTimeout)
    // }, [G.turnTimeout, turnEnd])

      

    const resetOptions = () => {
        setGridSelections([
            [
                {left: cloud, top: crop_empty},
                {left: cloud, top: crop_empty},
                {left: cloud, top: crop_empty},
            ],
            [
                {left: cloud, top: crop_empty},
                {left: cloud, top: crop_empty},
                {left: cloud, top: crop_empty}
            ],
            [
                {left: cloud, top: crop_empty},
                {left: cloud, top: crop_empty},
                {left: cloud, top: crop_empty},
            ]
        ]);

        setSelectedOption({left: '', top: ''})

    }
    // Selectors for both top and left options
    const selectLeftOption = (option) => {
        if (isOptionDisabled(option)) return;
        let tempObject = {...selectedOption};
        tempObject.left = option;
        setSelectedOption(tempObject);
    }

    const selectTopOption = (option) => {
        if (isOptionDisabled(option)) return;
        let tempObject = {...selectedOption};
        tempObject.top = option;
        setSelectedOption(tempObject);
    }

    //Match option selected on left to a bottom tile
    const selectLeftCrop = ((row, col) => {
        if(selectedOption.left !== '') {
            let tempGrid = [...gridSelections];
            tempGrid[row][col].left = selectedOption.left;
            setGridSelections(tempGrid);
            setGridWarnings([[false, false, false], [false, false, false], [false, false, false]]);
            setShowWarning(false);
        }
    })

    //Match option selected on the top to a top tile.
    const selectTopCrop = ((row, col) => {
        if(selectedOption.top !== '') {
            let tempGrid = [...gridSelections];
            tempGrid[row][col].top = selectedOption.top;
            setGridSelections(tempGrid);
            setGridWarnings([[false, false, false], [false, false, false], [false, false, false]]);
            setShowWarning(false);
        }
    })

    const submitMove = ((ignoreWarning) => {
        let tempGridWarnings = [[false, false, false], [false, false, false], [false, false, false]]
        let submitWaterGrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for(let i = 0; i < gridSelections.length; i++) {
            for(let j = 0; j < gridSelections[i].length; j++) {
                if(gridSelections[i][j].left === cloud) {
                    submitWaterGrid[i][j] = 0;
                }
                else if(gridSelections[i][j].left === river) {
                    submitWaterGrid[i][j] = 1;
                }
                else if(gridSelections[i][j].left === well) {
                    submitWaterGrid[i][j] = 2;
                }
            }
        }
        
        let submitCropGrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for(let i = 0; i < gridSelections.length; i++) {
            for(let j = 0; j < gridSelections[i].length; j++) {
                if(gridSelections[i][j].top === crop_high) {
                    submitCropGrid[i][j] = 2;
                }
                else if(gridSelections[i][j].top === crop_low) {
                    submitCropGrid[i][j] = 1;
                }
                else if(gridSelections[i][j].top === crop_empty) {
                    submitCropGrid[i][j] = 0;
                    if (submitWaterGrid[i][j] !== 0) {
                        tempGridWarnings[i][j] = true;
                    }
                }
            }
        }

        setGridWarnings(tempGridWarnings);
        if (!tempGridWarnings.flat(4).includes(true) || ignoreWarning) {
            moves.makeSelection(submitWaterGrid, submitCropGrid, playerID);
            let now = Date.now()
            let timerFunc = function (time, round) {
                console.log("Sending timer func")
                moves.advanceTimer(playerID, time, round)
            };
            setGridWarnings([[false, false, false], [false, false, false], [false, false, false]]);
            setShowWarning(false);
            // setTimeout(timerFunc, G.gameConfig.turnLength+1000, now, G.currentRound)
        } else {
            setShowWarning(true);
        }
    })

    return (
        <div className="col-lg-7 bg-green border-navy border-start-0 border-end-0" style={gameBoardStyle}>
            {(G.playerStats[playerID].selectionsSubmitted) &&
                <div className="overlay">
                    <div className='overlay-text'>
                        Year {G.currentRound} field selections submitted. Please wait for next year.
                    </div>
                </div>
            }
            <div className="row justify-content-center mt-4">
                <div className="col-3">
                    <div className="text-left">
                        <h5 className="text-light mt-2 mb-0"><span className="fw-bold text-white-50">Year:</span> {G.currentRound}</h5>
                        <h5 className="text-light mb-0"><span className="fw-bold text-white-50">Funds:</span> {G.playerStats[playerID].playerMoney.toFixed(2)}</h5>
                        <h5 className="text-light mb-0"><span className="fw-bold text-white-50">GW:</span> {G.playerStats[playerID].groundwaterDepth.toFixed(2)}</h5>
                    </div>
                </div>
                <div className="col-4">
                    <div className="bg-wet-dirt-bank text-center">
                        <h6 className="text-white-50 mt-2 mb-0">WATER options:</h6>
                        {leftOptions.map((option, index) => {
                            return(<SelectAction isHighlighted={option === selectedOption.left} image={option} altText="placeholder" key={index} onClick={() => {selectLeftOption(option)}} disabled={isOptionDisabled(option)}/>)
                        })}
                    </div>
                </div>
                <div className="col-4">
                    <div className="bg-dirt-bank text-center">
                        <h6 className="text-white-50 mt-2 mb-0">CROP options:</h6>
                        {topOptions.map((option, index) => {
                        return(<SelectAction isHighlighted={option === selectedOption.top} image={option} altText="placeholder" key={index} onClick={() => {selectTopOption(option)}} disabled={isOptionDisabled(option)}/>)
                        })}
                    </div>
                </div>
            </div>
            <div className="row justify-content-center my-3">
                <div className="col-9">
                    <div className="row justify-content-center mb-1">
                        <div className="text-white">
                            Players Submitted: {G.playerStats.filter(stat => stat.selectionsSubmitted == true).length}/{matchData.filter(player => ((!G.gameConfig.moderated || player.id != 0 ) && player.name != undefined && player.isConnected != undefined && player.isConnected == true)).length}
                        </div>
                        <div className="text-white text-end">
                            Clear all fields <img src={reset} alt="reset button" onClick={resetOptions} className="img-icon" style={clickableStyle}/> 
                        </div>
                    </div>
                    <div>
                        {gameGrid.map((subArray, i) => {
                            return (
                                <div className="row row-cols-3" key={i}>
                                    {subArray.map((crop, j) => {
                                        return (<GameTile key={crop} warning={gridWarnings[i][j]} topImage={gridSelections[i][j].left} bottomImage={gridSelections[i][j].top} topClick={() => {selectLeftCrop(i, j)}} bottomClick={() => selectTopCrop(i, j)}/>)
                                    })}
                                </div>)
                        })}
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-2">
                <div className="col-9">
                    <div class="row justify-content-center">
                    {showWarning ?
                        <div className="d-grid">
                            <button  
                                className="btn btn-warning"
                                onClick={() => submitMove(true)}
                                >
                                SUBMIT ANYWAY
                            </button>
                        </div>
                    : <div class="d-grid">
                        <button 
                            disabled={G.playerStats[playerID].selectionsSubmitted ? true : false} 
                            className={G.playerStats[playerID].selectionsSubmitted ? "btn btn-secondary" : "btn btn-submit"} 
                            onClick={() => submitMove(false)}
                            >
                            {G.playerStats[playerID].selectionsSubmitted ? "SUBMITTED SELECTIONS" : "SUBMIT"}
                        </button>
                        </div>
                    }
                    </div>
                </div>
            </div>
            {showWarning &&
            <div className="row justify-content-center my-2">
                <div className="col-12">
                    <div class="alert alert-warning p-2" role="alert">
                        <div class="small">
                            Warning: These fields will be considered to be Fallow. If this is correct, please click <span className="badge bg-warning text-dark">SUBMIT ANYWAY</span>. Otherwise, change the field options and then click <span className="badge bg-primary">SUBMIT</span>.
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}
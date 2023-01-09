import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { playerIDAtom } from '../atoms/pid';

// left-hand side options
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';

// top options "toptions", if you will.
import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import apple from '../img/apple.png';

// background image.
import grass from "../img/grass.png";

// Empty tile (default for irrigation method)
import empty_tile from "../img/empty_tile.png";

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
    backgroundColor: '#31a61e',
    height: '800px',
    backgroundImage: `url(${grass})`,
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

const leftOptions = [
    cloud,
    river,
    well
]

const topOptions = [
    leaf,
    apple,
    briefcase
]

// Individual crops on the game board.
const GameTile = ({
    theKey,
    topImage,
    bottomImage,
    topClick,
    bottomClick
}) => {
    return(
        <div style={{
            ...cropSquareStyle,
            border: 'solid black 4px',
            backgroundColor: '#8e4d26',
            width: '100px'
            }} 
            key={theKey}>
            <div style={{border: 'solid black 2px', textAlign: 'center'}} onClick={topClick}>
                <img src={topImage} style={miniTileStyle} />
            </div>
            <div style={{border: 'solid black 2px', textAlign: 'center'}} onClick={bottomClick}>
                <img src={bottomImage} style={miniTileStyle}/>
            </div>
           
        </div>
    )
}

// Options able to be selected during gameplay.
const SelectAction = ({
    isHighlighted,
    image,
    altText,
    onClick
}) => {
    return(<img src={image} 
            alt={altText} 
            style={{
                ...imgStyle,
                border: isHighlighted 
                ? 'solid cyan 4px' 
                : undefined
            }}
            onClick={onClick} />)
}

export function MainField({ G, moves }) {
    // On the gameGrid, the numbers inside the 2D array both provide a key for the crop and a way to set and compare the selected tile.
    const gameGrid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    //const [gridSelections, setGridSelections] = useState([[leaf, leaf, leaf], [leaf, leaf, leaf], [leaf, leaf, leaf]]);
    const [gridSelections, setGridSelections] = useState([
        [
            {left: empty_tile, top: empty_tile},
            {left: empty_tile, top: empty_tile},
            {left: empty_tile, top: empty_tile},
        ],
        [
            {left: empty_tile, top: empty_tile},
            {left: empty_tile, top: empty_tile},
            {left: empty_tile, top: empty_tile},
        ],
        [
            {left: empty_tile, top: empty_tile},
            {left: empty_tile, top: empty_tile},
            {left: empty_tile, top: empty_tile},
        ]
    ])
    const [selectedOption, setSelectedOption] = useState({left: '', top: ''});
    const [turnTimeLeft, setTurnTimeLeft] = useState(0);
    const [turnEnd, setTurnEnd, refTurnEnd] = useStateAndRef(0);
    const playerID = useRecoilValue(playerIDAtom);

    useEffect(() => {
        const interval = setInterval(() => {
          console.log()
          setTurnTimeLeft(refTurnEnd.current != 0 ? Math.floor((refTurnEnd.current - Date.now())/1000) : 0)
        }, 1000);
        return () =>  clearInterval(interval);
      }, []);

    
    useEffect(() => {
        setTurnEnd(G.turnTimeout)
        console.log("turn timeout", G.turnTimeout)
    }, [G.turnTimeout, turnEnd])

      

    const resetOptions = () => {
        setGridSelections([
            [
                {left: empty_tile, top: empty_tile},
                {left: empty_tile, top: empty_tile},
                {left: empty_tile, top: empty_tile},
            ],
            [
                {left: empty_tile, top: empty_tile},
                {left: empty_tile, top: empty_tile},
                {left: empty_tile, top: empty_tile}
            ],
            [
                {left: empty_tile, top: empty_tile},
                {left: empty_tile, top: empty_tile},
                {left: empty_tile, top: empty_tile},
            ]
        ]);

        setSelectedOption({left: '', top: ''})

    }
    // Selectors for both top and left options
    const selectLeftOption = (option) => {
        let tempObject = {...selectedOption};
        tempObject.left = option;
        setSelectedOption(tempObject);
    }

    const selectTopOption = (option) => {
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
        }
    })

    //Match option selected on the top to a top tile.
    const selectTopCrop = ((row, col) => {
        if(selectedOption.top !== '') {
            let tempGrid = [...gridSelections];
            tempGrid[row][col].top = selectedOption.top;
            setGridSelections(tempGrid);
        }
    })

    const submitMove = (() => {
        let submitWaterGrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for(let i = 0; i < gridSelections.length; i++) {
            for(let j = 0; j < gridSelections[i].length; j++) {
                if(gridSelections[i][j].left === cloud) {
                    submitWaterGrid[i][j] = 2;
                }
                else if(gridSelections[i][j].left === river) {
                    submitWaterGrid[i][j] = 3;
                }
                else if(gridSelections[i][j].left === well) {
                    submitWaterGrid[i][j] = 1;
                }
            }
        }
        
        let submitCropGrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for(let i = 0; i < gridSelections.length; i++) {
            for(let j = 0; j < gridSelections[i].length; j++) {
                if(gridSelections[i][j].top === apple) {
                    submitCropGrid[i][j] = 2;
                }
                else if(gridSelections[i][j].top === leaf) {
                    submitCropGrid[i][j] = 3;
                }
                else if(gridSelections[i][j].top === briefcase) {
                    submitCropGrid[i][j] = 1;
                }
            }
        }
        moves.makeSelection(submitWaterGrid, submitCropGrid, playerID);
        let now = Date.now()
        let timerFunc = function (time, round) {
            console.log("Sending timer func")
            moves.advanceTimer(playerID, time, round)
        };
        setTimeout(timerFunc, G.gameConfig.turnLength+1000, now, G.currentRound)
        resetOptions();

    })

    return (
        <div className="container thick-border" style={gameBoardStyle}>
            <div className="row">
                <div style={topSelectionsStyle}>
                    {topOptions.map((option, index) => {
                        return(<SelectAction isHighlighted={option === selectedOption.top} image={option} altText="placeholder" key={index} onClick={() => {selectTopOption(option)}}/>)
                    })}

                </div> 
            </div>
            <div className="row" style={{
                marginTop: '15%',
            }}>
                <div className="col">
                    <div style={selectionsStyle}>
                        {leftOptions.map((option, index) => {
                            return(<SelectAction isHighlighted={option === selectedOption.left} image={option} altText="placeholder" key={index} onClick={() => {selectLeftOption(option)}}/>)
                        })}
                    </div>
                </div>
                <div className="col-9">
                    <div style={cropGridStyle}>
                        {gameGrid.map((subArray, i) => {
                            return (
                                <div key={i}>
                                    {subArray.map((crop, j) => {
                                        return (<GameTile key={crop} topImage={gridSelections[i][j].top} bottomImage={gridSelections[i][j].left} topClick={() => {selectTopCrop(i, j)}} bottomClick={() => selectLeftCrop(i, j)}/>)
                                    })}
                                </div>)
                        })}
                    </div>
                </div>
            </div>
            <div className="row container" style={{display: 'flex', justifyContent: 'space-between', flexFlow: 'row'}}>
                <div style={{marginTop: '24px', marginLeft: 'auto', width: '50px'}}>
                    <img style={{height: '50px', width: '50px'}} src={reset} alt="reset button" onClick={resetOptions}></img>
                </div>
            </div>
            <div className="row">
                <button enabled={G.playerStats[playerID].selectionsSubmitted ? "disabled": ""} className="btn btn-primary" onClick={() => submitMove()} style={{ marginTop: '36px'}}>SUBMIT</button>
            </div>
            <div className="row text-right">
                <span>Turn Timer {Math.max(0,turnTimeLeft)}</span>
            </div>
        </div>
    )
}
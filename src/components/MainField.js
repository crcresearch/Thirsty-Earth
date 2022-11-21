import React from 'react';
import { useState } from 'react';
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
import grass from "../img/grass.png"

// Various styles used in the component.
const gameBoardStyle = {
    backgroundColor: '#31a61e',
    height: '800px',
    backgroundImage: `url(${grass})`,
}
const selectionsStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '50%'
}
const cropGridStyle = {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '5%',
    marginTop: '20%'

}
const cropSquareStyle = {
    borderStyle: 'solid'
}

const imgStyle = {
    width: '100px',
    height: '100px',
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
    image,
    onClick
}) => {
    return(
        <div style={{
            ...cropSquareStyle,
            border: 'solid black 4px'
            }} 
            key={theKey}
            onClick={onClick}>
            <img src={image} style={imgStyle}/>
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

export function MainField({ moves }) {
    // On the gameGrid, the numbers inside the 2D array both provide a key for the crop and a way to set and compare the selected tile.
    const gameGrid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const [gridSelections, setGridSelections] = useState([[leaf, leaf, leaf], [leaf, leaf, leaf], [leaf, leaf, leaf]]);
    const [selectedOption, setSelectedOption] = useState({left: '', top: ''});
    const playerID = useRecoilValue(playerIDAtom);

    const selectOption = ((option) => {
        setSelectedOption(option);
    })

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

    //For the given cell, change the tile to the option selected.
    const selectCrop = ((row, col) => {
        if(selectedOption !== '') {
            let tempGrid = [...gridSelections];
            tempGrid[row][col] = selectedOption.left;
            setGridSelections(tempGrid);
        }
    })

    const clearSelections = (() => {
        setGridSelections([[leaf, leaf, leaf], [leaf, leaf, leaf], [leaf, leaf, leaf]])
        setSelectedOption('');
    })

    const submitMove = (() => {
        let submitGrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for(let i = 0; i < gridSelections.length; i++) {
            for(let j = 0; j < gridSelections[i].length; j++) {
                if(gridSelections[i][j] === cloud) {
                    submitGrid[i][j] = 2;
                }
                if(gridSelections[i][j] === river) {
                    submitGrid[i][j] = 3;
                }
                if(gridSelections[i][j] === well) {
                    submitGrid[i][j] = 1;
                }
            }
        }
        moves.makeSelection(submitGrid, playerID);
        clearSelections();

    })

    return (
        <div className="container thick-border" style={gameBoardStyle}>
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
                                        return (<GameTile key={crop} image={gridSelections[i][j]} onClick={() => {selectCrop(i, j)}}/>)
                                    })}
                                </div>)
                        })}
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary" onClick={submitMove} style={{ marginTop: '36px'}}>SUBMIT</button>
            </div>
        </div>
    )

}
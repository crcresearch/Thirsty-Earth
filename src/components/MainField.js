import React from 'react';
import { useState } from 'react';

import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import well from '../img/well.png';
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
    marginTop: '30%'
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

const options = [
    cloud,
    river,
    well,
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
    const [selectedOption, setSelectedOption] = useState('');

    const selectOption = ((option) => {
        setSelectedOption(option);
    })

    //For the given cell, change the tile to the option selected.
    const selectCrop = ((row, col) => {
        if(selectedOption !== '') {
            let tempGrid = [...gridSelections];
            tempGrid[row][col] = selectedOption;
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
        moves.makeSelection(submitGrid);
        clearSelections();

    })

    return (
        <div className="container thick-border" style={gameBoardStyle}>
            <div className="row" style={{
                marginTop: '15%',
            }}>
                <div className="col">
                    <div style={selectionsStyle}>
                        {options.map((option, index) => {
                            return(<SelectAction isHighlighted={option === selectedOption} image={option} altText="placeholder" key={index} onClick={() => {selectOption(option)}}/>)
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
                <button className="btn btn-primary" onClick={submitMove}>SUBMIT</button>
            </div>
        </div>
    )

}
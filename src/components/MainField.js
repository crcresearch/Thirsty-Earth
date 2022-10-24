import React from 'react';
import { useState } from 'react';

import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import tumbleweed from '../img/tumbleweed.png';
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
    marginTop: '40%'

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
    briefcase,
    tumbleweed
]

// Individual crops on the game board.
const GameTile = ({
    theKey,
    isHighlighted,
    image,
    onClick
}) => {
    return(
        <div style={{
            ...cropSquareStyle,
            border: isHighlighted 
                ? 'solid cyan 4px' 
                : 'solid black 4px'
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

export function MainField() {
    // On the gameGrid, the numbers inside the 2D array both provide a key for the crop and a way to set and compare the selected tile.
    const gameGrid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedCrop, setSelectedCrop] = useState(0);

    const selectOption = ((option) => {
        setSelectedOption(option);
    })

    const selectCrop = ((cropNumber) => {
        if(selectedOption !== '') {
            setSelectedCrop(cropNumber);
        }
 
    })
    const clearSelections = (() => {
        setSelectedCrop(0);
        setSelectedOption('');
    })

    return (
        <div className="container thick-border" style={gameBoardStyle}>
            <div className="row">
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
                                    {subArray.map((crop) => {
                                        return (<GameTile key={crop} isHighlighted={crop === selectedCrop} image={selectedCrop !== crop || selectedOption === '' ? leaf : selectedOption} onClick={() => {selectCrop(crop)}}/>)
                                    })}
                                </div>)
                        })}
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary" onClick={clearSelections}>SUBMIT</button>
            </div>
        </div>
    )

}
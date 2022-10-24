import React from 'react';
import { useState, useEffect } from 'react';

import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import tumbleweed from '../img/tumbleweed.png';
import well from '../img/well.png';
import grass from "../img/grass.png"

const options = [
    cloud,
    river,
    well,
    briefcase,
    tumbleweed
]
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
    const [gameGrid, setGameGrid] = useState([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedCrop, setSelectedCrop] = useState(0);

    const selectOption = ((option) => {
        setSelectedOption(option);
    })

    const selectCrop = ((cropNumber) => {
        setSelectedCrop(cropNumber);
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
                                        return (<GameTile key={crop} isHighlighted={crop === selectedCrop} image={selectedCrop !== crop ? leaf : selectedOption} onClick={() => {selectCrop(crop)}}/>)
                                    })}
                                </div>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )

}
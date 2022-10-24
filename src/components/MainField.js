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
    image
}) => {
    return(
        <div style={{
            ...cropSquareStyle,
            border: isHighlighted 
                ? 'solid cyan 1px' 
                : undefined
            }} 
            key={theKey}>
            <img src={image} style={imgStyle}/>
        </div>
    )
}

const SelectAction = ({
    isHighlighted,
    image,
    altText
}) => {
    return(<img src={image} 
            alt={altText} 
            style={{
                ...imgStyle,
                border: isHighlighted 
                ? 'solid cyan 1px' 
                : undefined
            }} />)
}

export function MainField() {
    const [gameGrid, setGameGrid] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        let tempArray = gameGrid;
        for (let i = 0; i < tempArray.length; i++) {
            for (let j = 0; j < tempArray[i].length; j++) {
                let cellObject = {
                    image: leaf
                };
                tempArray[i][j] = { ...cellObject };
            }
        }
        setGameGrid(tempArray);
    }, [gameGrid]);



    const selectSquare = ((row, col) => {
        let tempArray = gameGrid;
        tempArray[row][col].image = cloud;
        setGameGrid(tempArray);
        console.log(gameGrid);
    });

    const selectOption = ((option) => {
        setSelectedOption(option);
        console.log(selectedOption)
    })



    return (
        <div className="container thick-border" style={gameBoardStyle}>
            <div className="row">
                <div className="col">
                    <div style={selectionsStyle}>
                        {options.map((option, index) => {
                            return(<SelectAction isHighlighted={option === selectedOption} image={option} altText="placeholder" key={index} onClick={() => selectOption(option)}/>)
                        })}
                    </div>
                </div>
                <div className="col-9">
                    <div style={cropGridStyle}>
                        {gameGrid.map((subArray, i) => {
                            return (
                                <div key={i}>
                                    {subArray.map((cell, j) => {
                                        return (<GameTile key={i + j} isHighlighted={false} image={leaf}/>)
                                    })}
                                </div>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )

}
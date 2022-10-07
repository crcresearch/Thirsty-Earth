import React from 'react';
import leaf from '../img/leaf.png';
import briefcase from '../img/briefcase.png';
import cloud from '../img/cloud.png';
import river from '../img/river.png';
import tumbleweed from '../img/tumbleweed.png';
import well from '../img/well.png';
import grass from "../img/grass.png"

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

const imgStyle = {
    width: '100px',
    height: '100px'
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

export function MainField() {
    return(
        <div className="container thick-border" style={gameBoardStyle}>
            <div className="row">
                <div className="col">
                    <div style={selectionsStyle}>
                        <img src={cloud} alt="use rainwater" style={imgStyle}/>
                        <img src={river} alt="use river water" style={imgStyle}/>
                        <img src={well} alt="use well water" style={imgStyle}/>
                        <img src={briefcase} alt="outside employment" style={imgStyle}/>
                        <img src={tumbleweed} alt="leave fallow" style={imgStyle}/>
                    </div>
                </div>
                <div className="col-9">
                    <div style={cropGridStyle}>
                        <div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                        </div>
                        <div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                        </div>
                        <div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                            <div style={cropSquareStyle}>
                                <img src={leaf} alt="crop" style={imgStyle} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
   
}
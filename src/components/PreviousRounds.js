import React from 'react';

export function PreviousRounds() {
    const prevRoundsStyle = {
        height: '800px'
    }
    return(
        <div className="card" style={prevRoundsStyle}>
            <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Previous Rounds</h5>
            </div>
            <div className="card-body">
                <p>placeholder</p>
            </div>
        </div>
    )
}
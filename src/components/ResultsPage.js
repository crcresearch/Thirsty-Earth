//Based on the following code: https://github.com/timbrownls20/Demo/blob/master/React/bootstrap-modal/src/components/Modal.jsx

import React from 'react';

const resultsStyle = {
    'height': '780px'
}

export function ResultsPage({ G, playerID }) {
    console.log(G.yearlyStateRecord)

    return (
        //If the flag determining whether the modal should be shown is true, show the modal. Else, keep it hidden.
        <div className="col-lg-7 border-navy border-start-0 border-end-0" style={resultsStyle}>
            <div className="row bg-med-navy">
                <h5 className="pt-1 text-center text-light">Game Summary</h5>
            </div>
            <div className='d-flex align-items-center justify-content-center' style={{height: "90%"}}>
                <ul className="list-group">
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h3">Rain Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_R, 0)}</li>
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h3">River Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_S, 0)}</li>
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h3">Groundwater Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_G, 0)}</li>
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h3">Total Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_Net, 0)}</li>
                </ul>
            </div>
        </div>
    )

};

export default ResultsPage
//Based on the following code: https://github.com/timbrownls20/Demo/blob/master/React/bootstrap-modal/src/components/Modal.jsx

import React from 'react';

const resultsStyle = {
    'height': '780px'
}

const tableScroll = {
    'height': '450px',
    'overflow-y': 'auto'
}

export function ResultsPage({ G, playerID }) {
    const countWaterAmounts = (statsRecord, water_enum) => {
        let playerCropChoices = statsRecord.playerCropFields.flat(4)
        let playerWaterChoices = statsRecord.playerWaterFields.flat(4)
        return playerWaterChoices.reduce(
        (accumulator, currentValue, currentIndex) => {
            return currentValue == water_enum && playerCropChoices[currentIndex] != 0 ? accumulator + 1 : accumulator
        },
        0
    )}
    const countFallowCrops = (statsRecord) => {
        let playerCropChoices = statsRecord.playerCropFields.flat(4)
        return playerCropChoices.reduce(
        (accumulator, currentValue) => {
            return currentValue == 0 ? accumulator + 1 : accumulator
        },
        0
    )}

    const generateSummaryRow = (yearlyStateRecord) => {
        console.log("Calling Generate Summary Row")
        let numF = 0
        let profitF = 0
        let numR =0
        let profitR = 0
        let numS =0
        let profitS = 0
        let numG = 0
        let profitG = 0
        for(let i = 1; i < yearlyStateRecord.length; i++) {
            console.log("PlayerStats")
            console.log(yearlyStateRecord[i].playerStats)
            for(let j = 0; j < yearlyStateRecord[i].playerStats[playerID].playerCropFields.flat(4).length ; j++) {
                if(yearlyStateRecord[i].playerStats[playerID].playerCropFields.flat(4)[j] == 0) {
                    numF++;
                    continue
                }
                else {
                    switch (yearlyStateRecord[i].playerStats[playerID].playerWaterFields.flat(4)[j]) {
                        case 0: 
                            numR++;
                            break;
                        case 2: 
                            numS++;
                            break;
                        case 2: 
                            numG++;
                            break;
                    }
                }
            }
            profitF += yearlyStateRecord[i].playerStats[playerID].Profit_F
            profitR += yearlyStateRecord[i].playerStats[playerID].Profit_R
            profitS += yearlyStateRecord[i].playerStats[playerID].Profit_S
            profitG += yearlyStateRecord[i].playerStats[playerID].Profit_G
        }
        return <tr className="fw-bold">
            <td>TOTAL</td>
            <td>{numF}</td>
            <td>{profitF.toFixed(2)}</td>
            <td>{numR}</td>
            <td>{profitR.toFixed(2)}</td>
            <td>{numS}</td>
            <td>{profitS.toFixed(2)}</td>
            <td>{numG}</td>
            <td>{profitG.toFixed(2)}</td>
            <td>{G.playerStats[playerID].playerMoney.toFixed(2)}</td>
        </tr>

    }

    return (
        //If the flag determining whether the modal should be shown is true, show the modal. Else, keep it hidden.
        <div className="col-lg-7 border-navy border-start-0 border-end-0" style={resultsStyle}>
            <div className="row bg-med-navy">
                <h5 className="pt-1 text-center text-light">Game Summary</h5>
            </div>
            <div className='d-flex align-items-center justify-content-center'>
                <ul className="list-group">
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h4">Fallow Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_F, 0).toFixed(2)}</li>
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h4">Rain Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_R, 0).toFixed(2)}</li>
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h4">River Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_S, 0).toFixed(2)}</li>
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h4">Groundwater Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_G, 0).toFixed(2)}</li>
                    <li className="list-group-item border-0 bg-tan text-center fw-bold h4">Total Profit: ${G.yearlyStateRecord.slice(1).reduce((partialSum, year) => partialSum + year.playerStats[playerID].Profit_Net, 0).toFixed(2)}</li>
                </ul>
            </div>
            <div style={tableScroll}>
                <table class="table table-success table-striped mt-3">
                <thead>
                    <tr>
                    <th scope="col">Year</th>
                    <th scope="col"># F</th>
                    <th scope="col">P_F</th>
                    <th scope="col"># R</th>
                    <th scope="col">P_R</th>
                    <th scope="col"># S</th>
                    <th scope="col">P_S</th>
                    <th scope="col"># G</th>
                    <th scope="col">P_G</th>
                    <th scope="col">P_Net</th>
                    </tr>
                </thead>
                <tbody>
                    {G.yearlyStateRecord.map((x, idx) => {
                        let yearFallow = countFallowCrops(x.playerStats[playerID])
                        let yearRain = countWaterAmounts(x.playerStats[playerID], 0)
                        let yearSurface = countWaterAmounts(x.playerStats[playerID], 1)
                        let yearGround = countWaterAmounts(x.playerStats[playerID], 2)
                        return idx > 0 && <tr>
                            <td>{idx}</td>
                            <td>{yearFallow}</td>
                            <td>{x.playerStats[playerID].Profit_F}</td>
                            <td>{yearRain}</td>
                            <td>{x.playerStats[playerID].Profit_R}</td>
                            <td>{yearSurface}</td>
                            <td>{x.playerStats[playerID].Profit_S}</td>
                            <td>{yearGround}</td>
                            <td>{x.playerStats[playerID].Profit_G}</td>
                            <td>{x.playerStats[playerID].Profit_Net}</td>
                        </tr>
                })}
                {generateSummaryRow(G.yearlyStateRecord)}
                {/* <tr>
                    <th scope="row">Ground</th>
                    <td>{countWaterAmounts(2,1)}</td>
                    <td>{countWaterAmounts(2,2)}</td>
                    <td>{year.playerStats[playerID].Profit_G}</td>
                </tr> */}
                </tbody>
                </table>
            </div>
        </div>
    )

};

export default ResultsPage
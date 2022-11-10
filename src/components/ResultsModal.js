//Based on the following code: https://github.com/timbrownls20/Demo/blob/master/React/bootstrap-modal/src/components/Modal.jsx

import React from 'react';

const modalContentStyle = {
    marginTop: '40%'
}

export function ResultsModal({ showModal, playerStats }) {
    return (
        //If the flag determining whether the modal should be shown is true, show the modal. Else, keep it hidden.
        <div
            className={`modal ${showModal ? ' modal-show' : ''}`}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content" style={modalContentStyle}>
                    <div className="modal-header">
                        <h4 className="modal-title">Game Summary</h4>
                    </div>
                    {/*Summary of both of the player's results*/}
                    <div className="modal-body">
                        <h5>Player 1 Results</h5>
                        <p>Money: {playerStats[0].playerMoney.toFixed(2)}</p>
                        <h5>Player 2 Results</h5>
                        <p>Money: {playerStats[1].playerMoney.toFixed(2)}</p>

                    </div>
                </div>
            </div>
        </div>
    )

};

export default ResultsModal
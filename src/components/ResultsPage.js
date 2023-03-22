//Based on the following code: https://github.com/timbrownls20/Demo/blob/master/React/bootstrap-modal/src/components/Modal.jsx

import React from 'react';

const resultsStyle = {
    'height': '950px'
}

export function ResultsPage({ G }) {
    return (
        //If the flag determining whether the modal should be shown is true, show the modal. Else, keep it hidden.
        <div className="col-lg bg-lt-navy border-navy" style={resultsStyle}>
            <div className="row bg-med-navy">
                <h5 className="pt-1 text-center text-light">Game Summary</h5>
            </div>
            
        </div>
    )

};

export default ResultsModal
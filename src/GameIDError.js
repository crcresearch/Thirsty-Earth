import React from "react";
import { Link } from "react-router-dom";

export function GameIDError() {
    return(
        <div className="container">
            <h1>Error!</h1>
            <p>You have either entered an incorrect or invalid game ID! Please return to <Link to="/">the lobby</Link> and try again.</p>
        </div>
    )
}
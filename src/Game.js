import { GAME_NAME } from "./config";

export const ThirstyEarth = {
    name: GAME_NAME,
    setup: (ctx) => { 
        const generatePlayerStats = () => {
            let stats = [];
            for(let i = 0; i < ctx.numPlayers; i++) {
                stats.push({
                    pid: i,
                    playerMoney: 100
                })
            }
            return stats;
        };
        let playerStats = generatePlayerStats();
        return {
            playerStats,
        }
    },

    turn: {
        minMoves: 1,
        maxMoves: 1
    }
}
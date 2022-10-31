import { GAME_NAME } from "./config";

export const ThirstyEarth = {
    name: GAME_NAME,
    setup: (ctx) => { 
        const FALLOW = 0;
        const GROUNDWATER = 1;
        const RAINWATER = 2;
        const RIVERWATER = 3;
        const defaultField = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        const generatePlayerStats = () => {
            let stats = [];
            for(let i = 0; i < ctx.numPlayers; i++) {
                stats.push({
                    pid: i,
                    playerMoney: 100,
                    playerFields: [...defaultField]
                })
            }
            return stats;
        };
        let playerStats = generatePlayerStats();
        return {
            playerStats,
            defaultField,
            FALLOW,
            GROUNDWATER,
            RAINWATER,
            RIVERWATER
        }
    },
    //Reset the player's choices after they play and their new totals are calculated
    resetPlayerBoards: (G) => {
        for(let i = 0; i < G.playerStats.length; i++ ) {
            G.playerStats[i].playerFields = [...G.defaultField];
        }
    },

    turn: {
        minMoves: 1,
        maxMoves: 1
    },
    phases: {
        playerMoves: {
            moves: {
                  //Override the player's current selections with their new selections
                  makeSelection: (G, ctx, newSelections) => {
                        console.log(newSelections);
                        G.playerStats[ctx.currentPlayer].playerFields = [...newSelections];
                    },
            }
        },
        moneyCalculation: {
            moves: {
                calculateNewTotals: (G, random) => {
                    const rainfallMultiplier = random.Number();
                    
                }
            }     
        }
    }
}
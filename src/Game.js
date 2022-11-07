import { GAME_NAME } from "./config";
import { TurnOrder } from 'boardgame.io/core';

export const ThirstyEarth = {
    name: GAME_NAME,
    setup: (ctx) => { 
        const FALLOW = 0;
        const GROUNDWATER = 1;
        const RAINWATER = 2;
        const RIVERWATER = 3;
        const defaultField = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        const defaultTally = {
            fallow: 0,
            groundWater: 0,
            rainWater: 0,
            riverWater: 0
        }

        const generatePlayerStats = () => {
            let stats = [];
            for(let i = 0; i < ctx.numPlayers; i++) {
                stats.push({
                    pid: i,
                    playerMoney: 100,
                    playerFields: [...defaultField],
                    playerChoiceTally: {...defaultTally},
                    playerHasPlayed: false
                })
            }
            return stats;
        };
        let playerStats = generatePlayerStats();
        // keep track of the current round
        let currentRound = 1;
        return {
            playerStats,
            defaultField,
            defaultTally,
            currentRound,
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
            G.playerStats[i].playerChoiceTally = {...G.defaultTally}
            G.playerStats[i].playerHasPlayed = false;
        }
    },

    //Count up the number of each choice that each player has made and store the result in the playerChoiceTally.
    countUpPlayerChoices: (G) => {
        for(let i = 0; i < G.playerStats.length; i++) {
            const playerFields = G.playerStats[i].playerFields;
            for(let j = 0; j < playerFields.length; j++) {
                for(let k = 0; k < playerFields[j].length; k++) {
                    switch(playerFields[j][k]) {
                        case G.FALLOW:
                            G.playerStats[i].playerChoiceTally.fallow++;
                            break;
                        case G.GROUNDWATER:
                            G.playerStats[i].playerChoiceTally.groundWater++;
                            break;
                        case G.RAINWATER:
                            G.playerStats[i].playerChoiceTally.rainWater++;
                            break;
                        case G.RIVERWATER:
                            G.playerStats[i].playerChoiceTally.riverWater++;
                            break;
                        default:
                            console.log("this shouldn't actually happen.");
                    }

                }
            }
        }
    },
    calculateNewTotals: (G, random, events) => {
       
        const rainfallMultiplier = (random.Number());

        //Go through the tallies of player choices and calculate cost and revenue for each crop.
        for(let i = 0; i < G.playerStats.length; i++) {
            let revenue = 0;
            let cost = 0;
            const playerTally = G.playerStats[i].playerChoiceTally;

            //calculate cost and revenue for river water crops
            revenue += (4 * playerTally.riverWater * rainfallMultiplier);
            cost += (2 * playerTally.riverWater);

            //calculate cost and revenue for groundwater crops
            if (ThirstyEarth.totalGroundWaterCrops(G) > 9) {
                revenue += (3 * playerTally.groundWater * rainfallMultiplier);
            }
            else {
                revenue += (5 * playerTally.groundWater * rainfallMultiplier);
            }
            cost += (3 * playerTally.groundWater);
            
            //calculate cost and revenue for rain water crops
            revenue += (2 * playerTally.rainWater * rainfallMultiplier);
            cost += playerTally.rainWater;

            //calculate cost and revenue for leaving fallow
            revenue += playerTally.fallow;
            G.playerStats[i].playerMoney += revenue - cost;
        }
        events.endPhase();
    },

    totalGroundWaterCrops: (G) => {
        let totalGWCrops = 0
        for(let i = 0; i < G.playerStats.length; i++) {
            totalGWCrops += G.playerStats[i].playerChoiceTally.groundWater;
        }
        return totalGWCrops;
    },

    turn: {
        minMoves: 1,
        maxMoves: 1,
        order: TurnOrder.RESET
    },
    phases: {
        playerMoves: {
            moves: {
                  //Override the player's current selections with their new selections
                  makeSelection: (G, ctx, newSelections) => {
                        G.playerStats[ctx.currentPlayer].playerFields = [...newSelections];
                        G.playerStats[ctx.currentPlayer].playerHasPlayed = true;
                    },
            },
            // End the phase if all of the players have made their selections.
            endIf: ((G) => {
                return(G.playerStats.every(player => player.playerHasPlayed === true))
                
            }),
            start: true,
            next: 'moneyCalculation'
        },
        moneyCalculation: {
            //I don't know if this is the best way to invoke my helper functions but it works
            onBegin: ((G, { random, events } ) => {
                ThirstyEarth.resetPlayerBoards(G);
                ThirstyEarth.countUpPlayerChoices(G);
                ThirstyEarth.calculateNewTotals(G, random, events)
                G.currentRound++;
                // if the five rounds have been played, end the game.
                if (G.currentRound > 5) {
                    events.endGame();
                }
            }),
            next: 'playerMoves'
        }
    }
}
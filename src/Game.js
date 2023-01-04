import { GAME_NAME } from "./config";
import { INVALID_MOVE, Stage } from 'boardgame.io/core';

export const ThirstyEarth = {
    name: GAME_NAME,
  // The minimum and maximum number of players supported
  // (This is only enforced when using the Lobby server component.)
  minPlayers: 1,
  maxPlayers: 40,
    setup: (ctx, setupData) => { 
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
        const turnTimeout = 0;

        const generatePlayerStats = () => {
            let stats = [];
            for(let i = 0; i < ctx.numPlayers; i++) {
                stats.push({
                    pid: i,
                    playerMoney: 100,
                    playerFields: [...defaultField],
                    playerChoiceTally: {...defaultTally},
                    selectionsSubmitted: false,
                    village: 0
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
            turnTimeout,
            FALLOW,
            GROUNDWATER,
            RAINWATER,
            RIVERWATER,
            gameConfig: setupData
        }
    },
    //Reset the player's choices after they play and their new totals are calculated
    resetPlayerBoards: (G) => {
        for(let i = 0; i < G.playerStats.length; i++ ) {
            G.playerStats[i].playerFields = [...G.defaultField];
            G.playerStats[i].playerChoiceTally = {...G.defaultTally}
            G.playerStats[i].selectionsSubmitted = false
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
            //console.log(G.playerStats[i].playerMoney, revenue, cost, rainfallMultiplier);
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
    phases: {
        setup: {
            moves: {
                  //Override the player's current selections with their new selections
                startGame: (G, ctx, newSelections, playerID ) => {
                    ctx.events.endPhase();
                },
                setVillageAssignments: (G, ctx, newSelections, playerID ) => {
                    for(let i = 0; i < newSelections.length; i++ ) {
                        G.playerStats[i].village = newSelections[i]
                    }
                }
            },
            onBegin: ((G, {events}) => {
                if (!G.gameConfig.moderated) {
                    events.endPhase();
                }
            }),
            turn: {
                activePlayers: [0],
            },
            start: true,
            next: 'playerMoves'
        },
        playerMoves: {
            moves: {
                //Override the player's current selections with their new selections
                makeSelection: (G, ctx, newSelections, playerID) => {
                    if(G.playerStats[playerID].selectionsSubmitted) {
                        return INVALID_MOVE
                    }
                    G.playerStats[playerID].playerFields = [...newSelections];
                    G.playerStats[playerID].selectionsSubmitted = true;
                    // If all players have gone (aka activePlayers does not have any players left in it, end the phase.)
                    let players_played = G.playerStats.reduce(
                        (accumulator, currentValue) => accumulator + (currentValue.selectionsSubmitted == true ? 1 : 0),
                        0
                      );
                      console.log("players_played", players_played)
                    if (players_played == (G.gameConfig.moderated? ctx.numPlayers - 1 : ctx.numPlayers)) {
                        ctx.events.endPhase();
                    }
                    else {
                        G.lastPlayerSubmitted = playerID
                        G.turnTimeout = Date.now() + G.gameConfig.turnLength
                    }
            },
                advanceYear: (G, ctx, playerID) => {
                    // console.log(G)
                    // console.log("PlayerID", playerID)
                    if(G.gameConfig.moderated === false || (G.gameConfig.moderated === true && playerID != 0)){
                        return INVALID_MOVE;
                    }
                    if (playerID == 0 && G.gameConfig.moderated === true) {
                        ctx.events.endPhase();
                    }
                },
                advanceTimer: (G, ctx, playerID, turnTimerStarted, round) => {
                    // console.log(G)
                    // console.log("PlayerID", playerID)
                    if(G.playerStats[playerID].selectionsSubmitted === false){
                        return INVALID_MOVE;
                    }
                    if(G.currentRound != round) {
                        return INVALID_MOVE;
                    }
                    if (Date.now() > G. turnTimeout) {
                        ctx.events.endPhase();
                    }
                },
            },
            turn: {
                activePlayers: {all: Stage.NULL, minMoves: 1, maxMoves: 2},
            },
            next: 'moneyCalculation'
        },
        moneyCalculation: {
            //I don't know if this is the best way to invoke my helper functions but it works
            onBegin: ((G, { random, events } ) => {
            
                ThirstyEarth.countUpPlayerChoices(G);
                ThirstyEarth.calculateNewTotals(G, random, events)
                ThirstyEarth.resetPlayerBoards(G);
                G.turnTimeout = 0
                G.currentRound++;
                // if the five rounds have been played, end the game.
                if (G.currentRound > G.gameConfig.numYears) {
                    events.endGame();
                }
            }),
            next: 'playerMoves'
        }
    }
}
import { GAME_NAME } from "./config";
import { INVALID_MOVE, Stage } from "boardgame.io/core";

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
      const defaultField = [
        [0, 0, 0], 
        [0, 0, 0], 
        [0, 0, 0]
      ];
      const defaultTally = {
          fallow: 0,
          groundWater: 0,
          rainWater: 0,
          riverWater: 0
      }
      const turnTimeout = 0;
      const playerOffset = setupData.moderated ? 1 : 0
      const villages = [...Array(setupData.numVillages + 1).keys()]
      const generatePlayerStats = () => {
          let stats = [];
          for(let i = 0; i < ctx.numPlayers; i++) {
              stats.push({
                  pid: i,
                  playerMoney: 100,
                  playerWaterFields: [...defaultField],
                  playerCropFields: [...defaultField],
                  playerChoiceTally: {...defaultTally},
                  selectionsSubmitted: false,
                  village: (setupData.moderated && i == 0) ? 0 : "unassigned",
                  groundwaterDepth: 0
              })
          }
          return stats;
      };
      let playerStats = generatePlayerStats();
      
      const generateVillageStats = () => {
        let stats = [];
        for(let i = 0; i < villages.length; i++) {
            stats.push({
                r0: 1
            })
        }
        return stats;
      };
      let villageStats = generateVillageStats();

      const yearlyStateRecord = []

      const publicInfo = null
      // keep track of the current round
      let currentRound = 1;
      return {
          villages,
          villageStats,
          playerStats,
          publicInfo,
          defaultField,
          defaultTally,
          currentRound,
          turnTimeout,
          FALLOW,
          GROUNDWATER,
          RAINWATER,
          RIVERWATER,
          yearlyStateRecord,
          gameConfig: setupData
      }
  },
  //Reset the player's choices after they play and their new totals are calculated
  resetPlayerBoards: (G) => {
      for (let i = 0; i < G.playerStats.length; i++ ) {
          G.playerStats[i].playerWaterFields = [...G.defaultField];
          G.playerStats[i].playerCropFields = [...G.defaultField];
          G.playerStats[i].playerChoiceTally = {...G.defaultTally}
          G.playerStats[i].selectionsSubmitted = false
      }
  },

  //Count up the number of each choice that each player has made and store the result in the playerChoiceTally.
  countUpPlayerChoices: (G) => {
    for (let i = 0; i < G.playerStats.length; i++) {
      const playerWaterFields = G.playerStats[i].playerWaterFields;
      for (let j = 0; j < playerWaterFields.length; j++) {
        for (let k = 0; k < playerWaterFields[j].length; k++) {
          switch (playerWaterFields[j][k]) {
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
  storeYearlyOutcomes: (G, data) => {
    let newYearlyStateObj = {};
    newYearlyStateObj["playerStats"] = JSON.parse(
      JSON.stringify(G.playerStats)
    );
    newYearlyStateObj["villageStats"] = JSON.parse(
      JSON.stringify(G.villageStats)
    );
    console.log(newYearlyStateObj["playerStats"][1].playerCropFields);
    // newYearlyStateObj["lastYearModelOutput"] = data;
    G.yearlyStateRecord.push(newYearlyStateObj);
  },
  calculateNewTotals: (G, events, data) => {
    //Go through the tallies of player choices and calculate cost and revenue for each crop.
    let playerIds = data[7][0].split(",")
    for (let i = 0; i < playerIds.length; i++) {
      G.playerStats[playerIds[i]].playerMoney =
        G.playerStats[playerIds[i]].playerMoney + data[2][i]["Profit_Net"];
      G.playerStats[playerIds[i]].groundwaterDepth = data[2][i]["New GW Depth"];
      for(const [key, value] of Object.entries(data[2][i])) {
        G.playerStats[playerIds[i]][key] = value;
      }
    }
    let villageId = data[6][0];
    G.villageStats[villageId]["r0"] = data[4][0];
    G.villageStats[villageId]["modelOutput"] = data;

  },

  totalGroundWaterCrops: (G) => {
    let totalGWCrops = 0;
    for (let i = 0; i < G.playerStats.length; i++) {
      totalGWCrops += G.playerStats[i].playerChoiceTally.groundWater;
    }
    return totalGWCrops;
  },
  phases: {
    setup: {
      moves: {
        //Start the game
        startGame: (G, ctx) => {
          if (G.publicInfo === null) {
            return INVALID_MOVE;
          }
          G.yearlyStateRecord.push({
            playerStats: G.playerStats.slice(),
            gwDepth: 2,
            lastYearModelOutput: {}
          })
          ctx.events.endPhase();
        },
        setVillageAssignment: (G, ctx, newSelection, playerID) => {
          G.playerStats[playerID].village = newSelection
        },
        setPublicInfo: (G, ctx, data) => {
          G.publicInfo = data
        },
      },
      onBegin: (G, { events }) => {
        if (!G.gameConfig.moderated) {
          events.endPhase();
        }
      },
      turn: {
        activePlayers: [0],
      },
      start: true,
      next: "playerMoves",
    },
    playerMoves: {
      moves: {
        //Override the player's current selections with their new selections
        makeSelection: (
          G,
          ctx,
          newWaterSelections,
          newCropSelections,
          playerID
        ) => {
          console.log(playerID);
          if (G.playerStats[playerID].selectionsSubmitted) {
            return INVALID_MOVE;
          }
          G.playerStats[playerID].playerWaterFields = [...newWaterSelections];
          G.playerStats[playerID].playerCropFields = [...newCropSelections];
          // console.log(G.playerStats[playerID].playerWaterFields)
          G.playerStats[playerID].selectionsSubmitted = true;
          // If all players have gone (aka activePlayers does not have any players left in it, end the phase.)
          let players_played = G.playerStats.reduce(
            (accumulator, currentValue) =>
              accumulator + (currentValue.selectionsSubmitted == true ? 1 : 0),
            0
          );
          console.log("players_played", players_played);
          if (
            players_played ==
            (G.gameConfig.moderated ? ctx.numPlayers - 1 : ctx.numPlayers)
          ) {
            // commented this out for now so moderator can run function to get round results, prevent automatically ending phase
            // ctx.events.endPhase();
          } else {
            G.lastPlayerSubmitted = playerID;
            G.turnTimeout = Date.now() + G.gameConfig.turnLength;
          }
        },
        resetSubmissions: (G, ctx) => {
          for (let i in G.playerStats) {
            G.playerStats[i].selectionsSubmitted = false;
          }
        },
        submitVillageDataUpdate: (G, ctx, playerID, computedData) => {
          // console.log(G)
          // console.log("PlayerID", playerID)
          if (
            G.gameConfig.moderated === false ||
            (G.gameConfig.moderated === true && playerID != 0)
          ) {
            return INVALID_MOVE;
          }
          if (playerID == 0 && G.gameConfig.moderated === true) {
            ThirstyEarth.calculateNewTotals(G, ctx.events, computedData);
          }
        },
        advanceYear: (G, ctx, playerID, computedData) => {
          // console.log(G)
          // console.log("PlayerID", playerID)
          if (
            G.gameConfig.moderated === false ||
            (G.gameConfig.moderated === true && playerID != 0)
          ) {
            return INVALID_MOVE;
          }
          if (playerID == 0 && G.gameConfig.moderated === true) {
            // ThirstyEarth.calculateNewTotals(G, ctx.events, computedData);
            ThirstyEarth.storeYearlyOutcomes(G, computedData);
            ThirstyEarth.resetPlayerBoards(G);
            G.turnTimeout = 0;
            G.currentRound++;
            // if the five rounds have been played, end the game.
            if (G.currentRound > G.gameConfig.numYears) {
              ctx.events.endGame();
            } else {
              ctx.events.endPhase();
            }
            ctx.events.endPhase();
          }
        },
        advanceTimer: (G, ctx, playerID, turnTimerStarted, round) => {
          // console.log(G)
          // console.log("PlayerID", playerID)
          if (G.playerStats[playerID].selectionsSubmitted === false) {
            return INVALID_MOVE;
          }
          if (G.currentRound != round) {
            return INVALID_MOVE;
          }
          if (Date.now() > G.turnTimeout) {
            ctx.events.endPhase();
          }
        },
      },
      turn: {
        // activePlayers: { all: Stage.NULL, minMoves: 1, maxMoves: 90 },
        activePlayers: { all: Stage.NULL},
      },
      next: "moderatorPause",
    },
    moderatorPause: {
      onBegin: (G, { events }) => {
        if (!G.gameConfig.moderated) {
          events.endPhase();
        }
      },
      moves: {
        advanceToPlayerMoves: (G, ctx, playerID) => {
          if (
            G.gameConfig.moderated === false ||
            (G.gameConfig.moderated === true && playerID != 0)
          ) {
            return INVALID_MOVE;
          }
          ctx.events.endPhase();
        },
        rewind: (G, ctx, playerID, yearToRewind) => {
          if (
            G.gameConfig.moderated === false ||
            (G.gameConfig.moderated === true && playerID != 0)
          ) {
            return INVALID_MOVE;
          }
          G.currentRound = yearToRewind;
          G.playerStats = JSON.parse(
            JSON.stringify(
              G.yearlyStateRecord[yearToRewind - 1].playerStats.slice()
            )
          );
          G.yearlyStateRecord = JSON.parse(
            JSON.stringify(G.yearlyStateRecord.slice(0, yearToRewind))
          );
        },
      },
      turn: {
        activePlayers: { all: Stage.NULL, minMoves: 1, maxMoves: 10 },
      },
      next: "playerMoves",
    },
  },
};

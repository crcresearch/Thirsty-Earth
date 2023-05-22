import { PostgresStore } from "bgio-postgres";
import { info } from "console";
import { writeFileSync } from "fs";

const matchId = process.argv[2]
const csvColumns = []

const getPlayerName = (stats, infoBit, playerMetadata) => {
    const villagePlayerID = stats.IBOutput[infoBit][0];
    const villagePlayers = stats.modelOutput[7][0].split(",");
    const gamePlayerID = villagePlayers[villagePlayerID-1];
    let playerName = "BOT"
    if (playerMetadata[gamePlayerID].name) {
        playerName = playerMetadata[gamePlayerID].name
    }
    return playerName
}
// node -r esm scripts/getGameCsv.js 1xzgX9iwNmk
// to run: node -r esm scripts/getGameCsv.js <matchId>
console.log(`getting match: ${matchId}...`)
// connect to database
const db = new PostgresStore(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`);
db.fetch(matchId, {
    state: true,
    metadata: true
}).then((matchInfo) => {
    const outputFile = `${matchId}-${matchInfo.metadata.setupData.gameLabel}.csv`;
    const yearlyStateRecord = matchInfo.state.G.yearlyStateRecord
    const setupDataKeys = Object.keys(matchInfo.metadata.setupData)
    const playerDataKeys = [
        "playerID",
        "playerName",
        "village",
        "groundwaterDepth",
        "rain",
        "playerMoney",
        "Profit_F",
        "Profit_R",
        "Profit_S",
        "Profit_G",
        "Profit_Net",
        "year",
        "cropChoices",
        "waterChoices"
    ]
    const pubInfoKeys = Object.keys(matchInfo.state.G.publicInfo)
    const infoBitKeys = [
        "Avg. # GW Fields",
        "Avg. # SW Fields",
        "Avg. # RW Fields", 
        "Avg. # Fallow Fields", 
        "Avg. # High Value Crops", 
        "Prob. of Good Rain Next Year",
        "Avg. GW Unit Cost",
        "Avg. SW Unit Cost",
        "Village Avg. Profit",
        "Player w/ Max Profit",
        "Max Village Profit",
        "Player w/ Max GW use",
        "Max Individual GW use",
        "Player w/ Max SW use",
        "Max Individual SW use",
        "Random player/GW usage",
        "Random player/SW usage",
        "Random player/RW usage", 
        "Random player/# fields Fallow",
        "Player w/ Max High Value Crop", 
        "Max # High Value Crops", 
        "Expected GW Recharge"
    ];
    csvColumns.push(...setupDataKeys, ...playerDataKeys, ...pubInfoKeys, ...infoBitKeys)
    let outputData = `${csvColumns.toString()}\n`
    for (let i in yearlyStateRecord) {
        if (i > 0) {
            let filterdStats = yearlyStateRecord[i].playerStats.filter(player => player.pid !== 0 && player.village !== "unassigned")
            filterdStats.sort((a,b) => a.village-b.village)
            for (let j in filterdStats) {
                let villageStats = yearlyStateRecord[i].villageStats[filterdStats[j].village]
                let infoBitDict = {}
                infoBitKeys.forEach((key) => {
                    if (Object.keys(villageStats).includes("IBOutput") && Object.keys(villageStats.IBOutput).includes(key)) {
                        if (villageStats.IBOutput[key].length > 1 && typeof villageStats.IBOutput[key][0] === "number") {
                            villageStats.IBOutput[key][0] = getPlayerName(villageStats, key, matchInfo.metadata.players)
                        }
                        infoBitDict[key] = `"${villageStats.IBOutput[key].toString()}"`;
                    } else {
                        infoBitDict[key] = ""
                    }
                })
                let playerName = matchInfo.metadata.players[filterdStats[j].pid.toString()].name;
                let baseInfo = {
                    playerID: filterdStats[j].pid,
                    playerName: playerName,
                    village: filterdStats[j].village,
                    groundwaterDepth: filterdStats[j].groundwaterDepth,
                    rain: villageStats["r0"],
                    playerMoney: filterdStats[j].playerMoney.toFixed(2),
                    Profit_F: filterdStats[j].Profit_F.toFixed(2),
                    Profit_R: filterdStats[j].Profit_R.toFixed(2),
                    Profit_S: filterdStats[j].Profit_S.toFixed(2),
                    Profit_G: filterdStats[j].Profit_G.toFixed(2),
                    Profit_Net: filterdStats[j].Profit_Net.toFixed(2),
                    year: i,
                    cropChoices: playerName ? `"${filterdStats[j].playerCropFields.flat(4).toString()}"` : '"1,1,1,2,2,0,0,0,0"',
                    waterChoices: playerName ? `"${filterdStats[j].playerWaterFields.flat(4).toString()}"` : '"1,1,1,1,1,1,1,0,0"'
                }
                const rowObj = Object.assign(
                    matchInfo.metadata.setupData, 
                    ...[
                        baseInfo,
                        matchInfo.state.G.publicInfo,
                        infoBitDict
                    ]
                )
                let rowColumns = []
                for (let k in csvColumns) {
                    let header = csvColumns[k];
                    rowColumns.push(rowObj[header])
                }
                const row = `${rowColumns.toString()}\n`
                outputData += row;
            }
        }
    }

    writeFileSync(`/var/exports/${outputFile}`, outputData)
    console.log(`Your CSV is ready to scp: /var/exports/${outputFile}`)
})

/*
test row:  {
  numYears: 10,
  playersPerVillage: 3,
  numVillages: 3,
  probabilityWetYear: 0.5,
  avgLengthDrySpell: 1.25,
  incProbabilityWetYearAnnual: 0,
  incAvgLengthDrySpellAnnual: 0,
  profitMultiplierGoodBadYear: 0.15,
  groundwaterRechargeGoodBadYear: 0.8,
  ratioReturnsRainVFallow: 1.2,
  ratioReturnsRainVSurfaceWater: 0.1,
  ratioReturnsRainVGroundWater: 0.06,
  multiplierProfitWaterHighValCrops: 2,
  profitPenaltyPerPersonPubInfo: 2,
  optimalFieldAllocationSWSelfish: 4,
  optimalFieldAllocationSWCommunity: 3,
  optimalFieldAllocationGWSelfishMyopic: 5,
  optimalFieldAllocationGWSelfishSustainable: 3,
  optimalFieldAllocationGWCommunity: 2,
  profitMarginalFieldFallow: 1,
  expectedGWRecharge: 3,
  recessionConstant: 1.75,
  ratioMaxLossesVExpectedRecharge: 0.9,
  moderated: true,
  turnLength: 30000,
  maxYears: 25,
  gameLabel: 'game3020304',
  playerID: 9,
  village: 3,
  groundwaterDepth: 0.28,
  rain: 1,
  playerMoney: '111.44',
  Profit_F: '2.00',
  Profit_R: '0.63',
  Profit_S: '21.60',
  Profit_G: '20.14',
  Profit_Net: '44.37',
  year: '2',
  cropChoices: '[[0,0,0],[0,0,0],[0,0,0]]',
  waterChoices: '[[0,0,0],[0,0,0],[0,0,0]]',
  alphaF: 1,
  alphaR1: 2.09,
  alphaR2: 0.31,
  alphaS: 14.4,
  betaS1: 1.2,
  betaS2: 0.24,
  alphaG: 28.07,
  betaG: 34.75,
  betaG1: 1.4,
  betaG2: 0.56
}
*/
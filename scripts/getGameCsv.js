import { PostgresStore } from "bgio-postgres";
import { writeFileSync } from "fs";

const matchId = process.argv[2]
const csvColumns = []

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
    console.log("pubInfo: ", matchInfo.state.G.publicInfo)
    csvColumns.push(...setupDataKeys, ...playerDataKeys, ...pubInfoKeys)
    let outputData = `${csvColumns.toString().replaceAll(",", "|")}\n`
    for (let i in yearlyStateRecord) {
        if (i > 0) {
            let filterdStats = yearlyStateRecord[i].playerStats.filter(player => player.pid !== 0 && player.village !== "unassigned")
            for (let j in filterdStats) {
                let baseInfo = {
                    playerID: filterdStats[j].pid,
                    village: filterdStats[j].village,
                    groundwaterDepth: filterdStats[j].groundwaterDepth,
                    rain: yearlyStateRecord[i].villageStats[filterdStats[j].village]["r0"],
                    playerMoney: filterdStats[j].playerMoney.toFixed(2),
                    Profit_F: filterdStats[j].Profit_F.toFixed(2),
                    Profit_R: filterdStats[j].Profit_R.toFixed(2),
                    Profit_S: filterdStats[j].Profit_S.toFixed(2),
                    Profit_G: filterdStats[j].Profit_G.toFixed(2),
                    Profit_Net: filterdStats[j].Profit_Net.toFixed(2),
                    year: i,
                    cropChoices: JSON.stringify(filterdStats[j].playerCropFields),
                    waterChoices: JSON.stringify(filterdStats[j].playerWaterFields)
                }
                const rowObj = Object.assign(
                    matchInfo.metadata.setupData, 
                    ...[
                        baseInfo,
                        matchInfo.state.G.publicInfo
                    ]
                )
                console.log("row: ", rowObj)
                let rowColumns = []
                for (let k in csvColumns) {
                    let header = csvColumns[k];
                    rowColumns.push(rowObj[header])
                }
                const row = `${rowColumns.slice(0,38).toString().replaceAll(",", "|")}|${rowColumns[38]}|${rowColumns[39]}|${rowColumns.slice(40).toString().replaceAll(",", "|")}\n`
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
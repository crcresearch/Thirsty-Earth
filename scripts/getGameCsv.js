import { PostgresStore } from "bgio-postgres";
import { writeFileSync } from "fs";

const matchId = process.argv[2]
const csvColumns = [
    "playerID",
    "village",
    "playerMoney",
    "year",
    "cropChoices",
    "waterChoices"
]

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
    
    const invidivualInfoKeys = Object.keys(yearlyStateRecord[2].lastYearModelOutput[0][1])
    const villageInfoKeys = Object.keys(yearlyStateRecord[2].lastYearModelOutput[1][1])
    const informationBitsKeys = Object.keys(yearlyStateRecord[2].lastYearModelOutput[2][0])
    csvColumns.push(...setupDataKeys, ...invidivualInfoKeys, ...villageInfoKeys, ...informationBitsKeys, "rain")
    let outputData = `${csvColumns.toString().replaceAll(",", "|")}\n`
    for (let i in yearlyStateRecord) {
        if (i > 0) {
            const informationBits = yearlyStateRecord[2].lastYearModelOutput[2][0];
            const rain = {rain: yearlyStateRecord[2].lastYearModelOutput[3][0]};
            for (let j in yearlyStateRecord[i].playerStats) {
                const invidivualInfo = yearlyStateRecord[i].lastYearModelOutput[0][j];
                const villageInfo = yearlyStateRecord[2].lastYearModelOutput[1][j];
                let baseInfo = {
                    playerID: yearlyStateRecord[i].playerStats[j].pid,
                    village: yearlyStateRecord[i].playerStats[j].village,
                    playerMoney: yearlyStateRecord[i].playerStats[j].playerMoney,
                    year: i,
                    cropChoices: JSON.stringify(yearlyStateRecord[i].playerStats[j].playerCropFields),
                    waterChoices: JSON.stringify(yearlyStateRecord[i].playerStats[j].playerWaterFields)
                }
                const rowObj = Object.assign(
                    baseInfo, 
                    ...[
                        matchInfo.metadata.setupData, 
                        invidivualInfo, 
                        villageInfo, 
                        informationBits, 
                        rain
                    ]
                )
                let rowColumns = []
                for (let k in csvColumns) {
                    let header = csvColumns[k];
                    rowColumns.push(rowObj[header])
                }
                const row = `${rowColumns.slice(0,4).toString().replaceAll(",", "|")}|${rowColumns[4]}|${rowColumns[5]}|${rowColumns.slice(6).toString().replaceAll(",", "|")}\n`
                outputData += row;
            }
        }
    }

    writeFileSync(`/var/exports/${outputFile}`, outputData)
    console.log(`Your CSV is ready to scp: /var/exports/${outputFile}`)
})
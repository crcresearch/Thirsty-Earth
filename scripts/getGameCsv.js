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
    csvColumns.push(...setupDataKeys, ...playerDataKeys, ...pubInfoKeys)
    let outputData = `${csvColumns.toString().replaceAll(",", "|")}\n`
    for (let i in yearlyStateRecord) {
        if (i > 0) {
            for (let j in yearlyStateRecord[i].playerStats) {
                let baseInfo = {
                    playerID: yearlyStateRecord[i].playerStats[j].pid,
                    village: yearlyStateRecord[i].playerStats[j].village,
                    groundwaterDepth: yearlyStateRecord[i].playerStats[j].groundwaterDepth,
                    rain: yearlyStateRecord[i].villageStats[yearlyStateRecord[i].playerStats[j].village]["r0"],
                    playerMoney: yearlyStateRecord[i].playerStats[j].playerMoney.toFixed(2),
                    Profit_F: yearlyStateRecord[i].playerStats[j].Profit_F.toFixed(2),
                    Profit_R: yearlyStateRecord[i].playerStats[j].Profit_R.toFixed(2),
                    Profit_S: yearlyStateRecord[i].playerStats[j].Profit_S.toFixed(2),
                    Profit_G: yearlyStateRecord[i].playerStats[j].Profit_G.toFixed(2),
                    Profit_Net: yearlyStateRecord[i].playerStats[j].Profit_Net.toFixed(2),
                    year: i,
                    cropChoices: JSON.stringify(yearlyStateRecord[i].playerStats[j].playerCropFields),
                    waterChoices: JSON.stringify(yearlyStateRecord[i].playerStats[j].playerWaterFields)
                }
                const rowObj = Object.assign(
                    matchInfo.metadata.setupData, 
                    ...[
                        baseInfo,
                        matchInfo.state.G.publicInfo
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
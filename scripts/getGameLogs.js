import { PostgresStore } from "bgio-postgres";
import { writeFileSync, mkdirSync, existsSync } from "fs";

const matchId = process.argv[2]

// to run: node -r esm scripts/getGameLogs.js <matchId>
console.log(`getting match: ${matchId}...`)
// connect to database
const db = new PostgresStore(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`);
db.fetch(matchId, {
    state: true,
    metadata: true, 
    initialState: true
}).then((matchInfo) => {
    const outputDir = `${matchId}-${matchInfo.metadata.setupData.gameLabel}`;
    const dirName = `/var/exports/${outputDir}`;
    const dirExists = existsSync(dirName)

    if (!dirExists) {
        // make directory for json files
        mkdirSync(dirName)
    
        // stringify json data
        const dataArray = [
            {filename: "initialState.json", json: JSON.stringify(matchInfo.initialState)},
            {filename: "finalState.json", json: JSON.stringify(matchInfo.state)},
            {filename: "yearlyStateRecord.json", json: JSON.stringify(matchInfo.state.G.yearlyStateRecord)}
        ]
    
        // write files
        for (let i in dataArray) {
            let dataDict = dataArray[i];
            writeFileSync(`${dirName}/${dataDict.filename}`, dataDict.json);
        }
        // write output directory name into text file to be read from bash script
        writeFileSync("/var/exports/outZip.txt", `outputFile="${outputDir}"`)
    } else {
        console.log(`The zip file for ${outputDir} already exists!`)
        writeFileSync("/var/exports/outZip.txt", `outputFile=""`)
    }
})
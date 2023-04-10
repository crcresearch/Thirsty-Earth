import { PostgresStore } from "bgio-postgres";

// to run: node -r esm scripts/getMatchIds.js
console.log("getting match ids...")
// connect to database
const db = new PostgresStore(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`);
db.listMatches().then(res => {
    for (let i in res) {
        let matchId = res[i]
        db.fetch(matchId, {
            state: true,
            metadata: true
        }).then((matchInfo) => {
            const yearlyStateRecord = matchInfo.state.G.yearlyStateRecord
            if (yearlyStateRecord.length > 1 && Object.keys(yearlyStateRecord[1].villageStats[1]).includes("IBOutput")) {
                console.log(matchId)
            }
        })
    }
})
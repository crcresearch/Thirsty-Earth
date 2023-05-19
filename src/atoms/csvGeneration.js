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

export const getGameData = (matchId, G, matchData) => {
    const csvColumns = []
    const outputFile = `${matchId}-${G.gameConfig.gameLabel}.csv`;
    const yearlyStateRecord = G.yearlyStateRecord
    const setupDataKeys = Object.keys(G.gameConfig)
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
    const pubInfoKeys = Object.keys(G.publicInfo)
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
        "Random player/# fields Fallow"
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
                            villageStats.IBOutput[key][0] = getPlayerName(villageStats, key, matchData)
                        }
                        infoBitDict[key] = `"${villageStats.IBOutput[key].toString()}"`;
                    } else {
                        infoBitDict[key] = ""
                    }
                })
                let playerName = matchData[filterdStats[j].pid.toString()].name;
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
                    G.gameConfig, 
                    ...[
                        baseInfo,
                        G.publicInfo,
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
    return {data: outputData, file: outputFile}
}
#!/bin/sh

# create temp file for setting variable outputFile
touch /var/exports/outZip.txt
node -r esm scripts/getGameLogs.js $1

#set variable by reading command from temporary file
eval "$(cat /var/exports/outZip.txt)"

#cd and create zip if outputFile found
if [ -n "$outputFile" ]
then
    cd "/var/exports/$outputFile"
    zip -q "../$outputFile" "initialState.json" "finalState.json" "yearlyStateRecord.json"
    echo "The zip file for $outputFile is ready to scp."
fi

# delete temp file
rm /var/exports/outZip.txt
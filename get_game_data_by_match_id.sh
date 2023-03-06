#!/bin/sh

# create temp file for setting variable outputFile
touch /var/exports/outZip.txt
node -r esm scripts/getGameLogs.js $1

#set variable by reading command from temporary file
eval "$(cat /var/exports/outZip.txt)"

#cd and create zip
cd "/var/exports/$outputFile"
zip "../$outputFile" "initialState.json" "finalState.json" "yearlyStateRecord.json"

# delete temp file
rm /var/exports/outZip.txt
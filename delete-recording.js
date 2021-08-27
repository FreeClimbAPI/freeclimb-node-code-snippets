require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = freeclimbSDK(accountId, apiKey)

// Users must provide the recordingId for the recording they wish to delete
freeclimb.api.recordings.delete(recordingId).catch (err => {/** Catch Errors */ })

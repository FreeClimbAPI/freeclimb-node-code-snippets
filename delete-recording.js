require('dotenv').config()
const { createConfiguration, DefaultApi } = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

// Users must provide the recordingId for the recording they wish to delete
freeclimb.deleteARecording(recordingId).catch (err => {/** Catch Errors */ })

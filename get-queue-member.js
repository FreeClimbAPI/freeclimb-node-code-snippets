require('dotenv').config()
const { createConfiguration, DefaultApi } = require('@freeclimb/sdk')
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

const queueId = 'QUEUE_ID'
const callId = 'CALL_ID'

// Invoke get Queue Member call
freeclimb.getAMember(queueId, callId).then(member => {
  // Use the queue member
}).catch(err => {/** Catch Errors */ })

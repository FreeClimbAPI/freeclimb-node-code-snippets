require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = freeclimbSDK(accountId, apiKey)

// Retreive a queue by queueId
freeclimb.api.queues.get(queueId).then(queue => {
  // Use the queue object
}).catch(err => {/** Catch Errors */ })

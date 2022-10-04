require('dotenv').config()
const { createConfiguration, DefaultApi } = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

const queueId = 'QUEUE_ID'
// Retreive a queue by queueId
freeclimb.getAQueue(queueId).then(queue => {
  // Use the queue object
}).catch(err => {/** Catch Errors */ })

require('dotenv').config()
const { createConfiguration, DefaultApi, QueueRequest } = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

// New queue options
const options = {
  alias: 'New Name',
  maxSize: 100
}

// Invoke the update queue resource
freeclimb.updateAQueue(queueId, new QueueRequest(options)).then(queue => {
  // Use updated Queue
}).catch(err => {
  // Handle Errors
})

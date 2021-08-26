require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = freeclimbSDK(accountId, apiKey)

const options = {
  alias: 'Tutorial Queue',
  maxSize: 25
}
//Invoke method to create a queue with the options provided
freeclimb.api.queues.create(options).then(queue => {
  // use created queue
  const queueId = queue.queueId
  freeclimb.api.queues.get(queueId).then(queue => {
    console.log(queue)
  })
}).catch(err => {
  // Catch Errors
})

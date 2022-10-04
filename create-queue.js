require('dotenv').config()
const { createConfiguration, DefaultApi, QueueRequest } = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

const options = {
  alias: 'Tutorial Queue',
  maxSize: 25
}
//Invoke method to create a queue with the options provided
freeclimb.createAQueue(new QueueRequest(options)).then(queue => {
  // use created queue
  const queueId = queue.queueId

  freeclimb.getAQueue(queueId).then(queue => {
    console.log(queue)
  })
}).catch(err => {
  // Catch Errors
})

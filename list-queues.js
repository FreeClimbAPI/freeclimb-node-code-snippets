require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = freeclimbSDK(accountId, apiKey)

getQueues().then(queues => {
  // Use Queues
  console.log(queues)
}).catch(err => {
  // Catch Errors
  console.log(err)
})

async function getQueues() {
  // Create array to store all queues
  const queues = []
  // Invoke GET method to retrieve initial list of queues information
  const first = await freeclimb.api.queues.getList()
  queues.push(...first.queues)
  // Get Uri for next page
  let nextPageUri = first.nextPageUri
  // Retrieve entire queues list 
  while (nextPageUri) {
    const nextPage = await freeclimb.api.queues.getNextPage(nextPageUri)
    queues.push(...nextPage.queues)
    nextPageUri = nextPage.nextPageUri
  }
  return queues
}

require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = freeclimbSDK(accountId, apiKey)

getMembers(queueId).then(members => {
  // Use queue members
}).catch(err => {
  // Catch Errors
})

async function getMembers(queueId) {
  // Create array to store all members 
  const members = []
  // Invoke GET method to retrieve initial list of members information
  const first = await freeclimb.api.queues.members(queueId).getList()
  members.push(...first.queueMembers)
  // Get Uri for next page
  let nextPageUri = first.nextPageUri
  // Retrieve entire members list 
  while (nextPageUri) {
    const nextPage = await freeclimb.api.queues.members(queueId).getNextPage(nextPageUri)
    members.push(...nextPage.queueMembers)
    nextPageUri = nextPage.nextPageUri
  }
  return members
}

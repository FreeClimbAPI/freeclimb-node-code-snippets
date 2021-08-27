require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = freeclimbSDK(accountId, apiKey)

getRecordings().then(recordings => {
  // Use recordings
}).catch(err => {
  // Catch Errors
})

async function getRecordings() {
  // Create array to store all recordings
  const recordings = []
  // Invoke GET method to retrieve initial list of recordings information
  const first = await freeclimb.api.recordings.getList()
  recordings.push(...first.recordings)
  // Get Uri for next page
  let nextPageUri = first.nextPageUri
  // Retrieve entire recordings list 
  while (nextPageUri) {
    const nextPage = await freeclimb.api.recordings.getNextPage(nextPageUri)
    recordings.push(...nextPage.recordings)
    nextPageUri = nextPage.nextPageUri
  }
  return recordings
}

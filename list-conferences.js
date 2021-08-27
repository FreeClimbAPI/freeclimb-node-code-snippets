require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = freeclimbSDK(accountId, apiKey)

getConferences().then(conferences => {
  // Use conferences
}).catch(err => {
  // Catch Errors
})

async function getConferences() {
  // Create array to store all conferences
  const conferences = []
  // Invoke GET method to retrieve initial list of conferences information
  const first = await freeclimb.api.conferences.getList()
  conferences.push(...first.conferences)
  // Get Uri for next page
  let nextPageUri = first.nextPageUri
  // Retrieve entire conferences list 
  while (nextPageUri) {
    const nextPage = await freeclimb.api.conferences.getNextPage(nextPageUri)
    conferences.push(...nextPage.conferences)
    nextPageUri = nextPage.nextPageUri
  }
  return conferences
}

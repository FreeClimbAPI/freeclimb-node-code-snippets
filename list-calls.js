require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = freeclimbSDK(accountId, apiKey)

getCallsList().then(calls => {
  // Use the calls
}).catch(err => {
  // Catch Errors
})

async function getCallsList() {
  // Create array to store all calls
  const calls = []
  // Invoke GET method to retrieve initial list of call information
  const first = await freeclimb.api.calls.getList()
  calls.push(...first.calls)
  // Get Uri for next page
  let nextPageUri = first.nextPageUri
  // Retrieve entire call list 
  while (nextPageUri) {
    const nextPage = await freeclimb.api.calls.getNextPage(nextPageUri)
    calls.push(...nextPage.calls)
    nextPageUri = nextPage.nextPageUri
  }
  return calls
}

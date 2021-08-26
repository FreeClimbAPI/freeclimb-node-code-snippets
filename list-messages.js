require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = freeclimbSDK(accountId, apiKey)

getMessages().then(messages => {
  // Use messages
}).catch(err => {
  // Catch Errors
})

async function getMessages() {
  // Create array to store all members 
  const messages = []
  // Invoke GET method to retrieve initial list of members information
  const first = await freeclimb.api.messages.getList()
  messages.push(...first.messages)
  // Get Uri for next page
  let nextPageUri = first.nextPageUri
  // Retrieve entire members list 
  while (nextPageUri) {
    const nextPage = await freeclimb.api.messages.getNextPage(nextPageUri)
    messages.push(...nextPage.messages)
    nextPageUri = nextPage.nextPageUri
  }
  return messages
}

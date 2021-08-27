require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = freeclimbSDK(accountId, apiKey)

// Invoke get participants method
getConferenceParticipants(conferenceId).then(participants => {
  // Use participants
}).catch(err => {
  // Catch Errors
})

async function getConferenceParticipants(conferenceId) {
  // Create array to store all participants
  const participants = []
  // Invoke GET method to retrieve initial list of participant information
  const first = await freeclimb.api.conferences.participants(conferenceId).getList()
  participants.push(...first.participants)
  // Get Uri for next page
  let nextPageUri = first.nextPageUri
  // Retrieve entire participant list 
  while (nextPageUri) {
    const nextPage = await freeclimb.api.conferences.participants(conferenceId).getNextPage(nextPageUri)
    participants.push(...nextPage.participants)
    nextPageUri = nextPage.nextPageUri
  }
  return participants
}

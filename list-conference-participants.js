require('dotenv').config()
const { createConfiguration, DefaultApi } = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

// Invoke get participants method
getConferenceParticipants(conferenceId).then(participants => {
  // Use participants
}).catch(err => {
  // Catch Errors
})

async function getConferenceParticipants(conferenceId) {
  // Create array to store all participants
  const participants = await freeclimb.listParticipants(conferenceId)
  /**
   * At the time of this writing, the freeclimb nodejs sdk (v3.0.1)
   * generated via the openapi generator does not provide the facility for pagination
   */
  return participants
}

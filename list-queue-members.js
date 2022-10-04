require('dotenv').config()
const { createConfiguration, DefaultApi } = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

getMembers(queueId).then(members => {
  // Use queue members
}).catch(err => {
  // Catch Errors
})

async function getMembers(queueId) {
  // Create array to store all members 
  const members = await freeclimb.listMembers(queueId)
  /**
   * At the time of this writing, the freeclimb nodejs sdk (v3.0.1)
   * generated via the openapi generator does not provide the facility for pagination
   */
  return members
}

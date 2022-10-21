require('dotenv').config()
const { createConfiguration, DefaultApi } = require('@freeclimb/sdk')

const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

getConferences().then(conferences => {
  // Use conferences
}).catch(err => {
  // Catch Errors
})

async function getConferences() {
  // Create array to store all conferences
  const conferences = await freeclimb.listConferences()
  /**
   * At the time of this writing, the freeclimb nodejs sdk (v3.0.1)
   * generated via the openapi generator does not provide the facility for pagination
   */
  return conferences
}

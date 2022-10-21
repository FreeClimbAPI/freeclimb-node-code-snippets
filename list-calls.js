require('dotenv').config()
const { createConfiguration, DefaultApi } = require('@freeclimb/sdk')
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({accountId, apiKey}))

getCallsList().then(calls => {
  // Use the calls
}).catch(err => {
  // Catch Errors
})

async function getCallsList() {
  // Create array to store all calls
  const calls = await freeclimb.listCalls()
  /**
   * At the time of this writing, the freeclimb nodejs sdk (v3.0.1)
   * generated via the openapi generator does not provide the facility for pagination
   */
  return calls
}

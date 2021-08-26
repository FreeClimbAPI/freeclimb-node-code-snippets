require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = freeclimbSDK(accountId, apiKey)

freeclimb.api.recordings.stream(recordingId).then(stream => {
  stream.on('data', chunk => {
    console.log(`Received ${chunk.length} bytes of data.`)
  })
  stream.on('end', () => {
    console.log('no more data!')
  })
}).catch(err => {
  // Handle Errors
})

require('dotenv').config()
const { createConfiguration, DefaultApi } = require('@freeclimb/sdk')
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))
const recordingId = 'example recording id'

freeclimb.streamARecordingFile(recordingId).then(stream => {
  stream.on('data', chunk => {
    console.log(`Received ${chunk.length} bytes of data.`)
  })
  stream.on('end', () => {
    console.log('no more data!')
  })
}).catch(err => {
  // Handle Errors
})

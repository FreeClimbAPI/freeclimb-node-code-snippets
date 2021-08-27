require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const freeclimbSDK = require('@freeclimb/sdk')

const app = express()
app.use(bodyParser.json())

const port = process.env.PORT || 80
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = freeclimbSDK(accountId, apiKey)
const applicationId = process.env.APPLICATION_ID

// Invoke create method to initiate the asynchronous outdial request
freeclimb.api.calls.create(to, from, applicationId).catch(err => {/* Handle Errors */ })

// Handles incoming calls. Set with 'Call Connect URL' in App Config
app.post('/incomingCall', (req, res) => {
  // Create PerCL say script
  const say = freeclimb.percl.say('You just made a call with the FreeClimb API')
  
  // Create PerCL record utterance script
  const percl = freeclimb.percl.build(say)
  res.status(200).json(percl)
})

app.listen(port, () => {
  console.log(`started the server on port ${port}`)
})

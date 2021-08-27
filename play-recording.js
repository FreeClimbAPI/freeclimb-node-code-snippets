require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const freeclimbSDK = require('@freeclimb/sdk')

const app = express()
app.use(bodyParser.json())
// Where your app is hosted ex. www.myapp.com
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
  const play = freeclimb.percl.play(recordingUrl)
  const percl = freeclimb.percl.build(play)
  res.status(200).json(percl)
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Started server on port ${port}`)
})

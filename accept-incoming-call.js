require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const freeclimbSDK = require('@freeclimb/sdk')

app.use(bodyParser.json())
var port = process.env.PORT || 80
const freeclimb = freeclimbSDK()

// Handles incoming calls
app.post('/incomingCall', (req, res) => {

  // Create PerCL say script 
  const say = freeclimb.percl.say('Hello. Thank you for invoking the accept incoming call tutorial.')

  // Create PerCL pause script with a duration of 100 milliseconds
  const pause = freeclimb.percl.pause(100)

  // Create PerCL say script
  const sayGoodbye = freeclimb.percl.say('Goodbye')

  // Create PerCL hangup script
  const hangup = freeclimb.percl.hangup()

  // Build scripts
  const percl = freeclimb.percl.build(say, pause, sayGoodbye, hangup)

  // Convert PerCL container to JSON and append to response
  res.status(200).json(percl)
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Starting server on port ${port}`)
})

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { createConfiguration, DefaultApi, MakeCallRequest, Say, RecordUtterance, PerclScript, Play } = require('@freeclimb/sdk')

const app = express()
app.use(bodyParser.json())
// Where your app is hosted ex. www.myapp.com
const host = process.env.HOST
const port = process.env.PORT || 80
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const applicationId = process.env.APPLICATION_ID
const fromNumber = process.env.FROM_NUMBER
const toNumber = process.env.TO_NUMBER
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

// Invoke create method to initiate the asynchronous outdial request
freeclimb.makeACall(new MakeCallRequest({ _from: fromNumber, to: toNumber, applicationId })).catch(err => {/* Handle Errors */ })

// Handles incoming calls. Set with 'Call Connect URL' in App Config
app.post('/incomingCall', (req, res) => {
  // Create PerCL say script
  const say = new Say({ text: 'Hello. Please leave a message after the beep, then press one or hangup.' })
  // Create PerCL record utterance script
  const record = new RecordUtterance({ actionUrl: `${host}/finishedRecording`, playBeep: true, finishOnKey: '1' })
  const percl = new PerclScript({ commands: [say, record] }).build()
  res.status(200).json(percl)
})

app.post('/finishedRecording', (req, res) => {
  const recordingResponse = req.body
  const say = new Say({ text: 'This is what you have recorded' })
  const play = new Play({ recordingUrl:  recordingResponse.recordingUrl })
  const goodbye = new Say({ text: 'Goodbye' })
  const percl = new PerclScript({ commands: [say, play, goodbye] }).build()
  res.status(200).json(percl)
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`started the server on port ${port}`)
})

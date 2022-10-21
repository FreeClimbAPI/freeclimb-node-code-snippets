require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { UpdateConferenceRequest, CreateConference, PerclScript, Say, OutDial, AddToConference, createConfiguration, DefaultApi }= require('@freeclimb/sdk')

const app = express()
app.use(bodyParser.json())
// Where your app is hosted ex. www.myapp.com
const host = process.env.HOST
const port = process.env.PORT || 80
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

app.post('/incomingCall', (req, res) => {
  const conference = new CreateConference({ actionUrl: `${host}/conferenceCreated` })
  const percl = new PerclScript({ commands: [conference] }).build()
  res.status(200).json(percl)
})

app.post('/conferenceCreated', (req, res) => {
  const createConferenceResponse = req.body
  const conferenceId = createConferenceResponse.conferenceId
  const say = new Say({ text: 'Please wait while we attempt to connect you to an agent.' })
  // implementation of lookupAgentPhoneNumber() is left up to the developer
  const agentPhoneNumber = lookupAgentPhoneNumber()
  // Make OutDial request once conference has been created
  const outDial = new OutDial({
    desetination: agentPhoneNumber,
    callingNumber: createConferenceResponse.from,
    actionUrl: `${host}/outboundCallMade/${conferenceId}`,
    callConnectUrl: `${host}/callConnected/${conferenceId}`,
    // Hangup if we get a voicemail machine
    ifMachine: 'hangup'
  })
  const percl = new PerclScript({ commands: [say, outDial] }).build()
  res.status(200).json(percl)
})

app.post('/outboundCallMade/:conferenceId', (req, res) => {
  const outboundCallResponse = req.body
  const conferenceId = req.params.conferenceId
  // Add initial caller to conference
  const addToConference = new AddToConference({
    conferenceId,
    callId: outboundCallResponse.callId,
  // set the leaveConferenceUrl for the inbound caller, so that we can terminate the conference when they hang up
    leaveConferenceUrl: `${host}/leftConference`
  })
  const percl = new PerclScript({ commands: [addToConference] }).build()
  res.status(200).json(percl)
})

app.post('/callConnected/:conferenceId', (req, res) => {
  const callConnectedResponse = req.body
  const conferenceId = req.params.conferenceId
  if (callConnectedResponse.dialCallStatus != 'inProgress') {
    // Terminate conference if agent does not answer the call. Can't use PerCL command since PerCL is ignored if the call was not answered.
    terminateConference(conferenceId)
    return res.status(200).json([])
  }
  const addToConference = new AddToConference({ conferenceId, callId: callConnectedResponse.callId })
  const percl = new PerclScript({ commands: [addToConference] }).build()
  res.status(200).json(percl)
})

app.post('/leftConference', (req, res) => {
  // Call terminateConference when the initial caller hangsups
  const leftConferenceResponse = req.body
  const conferenceId = leftConferenceResponse.conferenceId
  terminateConference(conferenceId)
  res.status(200).json([])
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Starting server on port ${port}`)
})

function terminateConference(conferenceId) {
  // Create the ConferenceUpdateOptions and set the status to terminated
  return freeclimb.updateAConference(conferenceId, new UpdateConferenceRequest({ status: 'terminated' })).catch(err => {/* Handle Errors */})
}
function lookupAgentPhoneNumber() {
  // Implement this!
}
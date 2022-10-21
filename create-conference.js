require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { DefaultApi, createConfiguration, GetDigits, Say, CreateConference, AddToConference, PerclScript, UpdateConferenceRequest } = require('@freeclimb/sdk')

const app = express()
app.use(bodyParser.json())
// Where your app is hosted ex. www.myapp.com
const host = process.env.HOST
const port = process.env.PORT || 80
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

function ConferenceRoom() {
  // stores conferenceId associated with this room
  this.conferenceId = null

  // true if the CreateConference command was sent but the actionUrl has not yet been called, else false
  this.isConferencePending = false

  // Set to true after the conference status is first set to EMPTY, meaning that the next EMPTY status received indicates that all participants have left the conference and so the conference can terminate
  this.canConferenceTerminate = false
}

const conferenceRoomsCodes = ['1', '2', '3']
const conferenceRooms = new Map()

for (let code in conferenceRoomsCodes) {
  conferenceRooms.set(code, new ConferenceRoom())
}

app.post('/incomingCall', (req, res) => {
  // Create PerCL say command
  const greeting = new Say({ text: 'Hello. Welcome to the conferences tutorial, please enter your access code.' })
  // Create PerCL for getDigits command
  const getDigits = new GetDigits({
    actionUrl: `${host}/gotDigits`,
    maxDigits: 1,
    minDigits: 1,
    flushBuffer: true
  })
  // Build and respond with Percl command
  const percl = new PerclScript({ commands: [greeting, getDigits] }).build()
  res.status(200).json(percl)
})

app.post('/gotDigits', (req, res) => {
  const getDigitsResponse = req.body
  const digits = getDigitsResponse.digits
  const callId = getDigitsResponse.callId

  const room = conferenceRooms.get(digits)
  if (room === undefined) {
    // Handle case where no room with the given code exists
  }
  // if participants can't be added yet (actionUrl callback has not been called) notify caller and hang up
  if (room.isConferencePending) {
    const say = new Say({ text: 'We are sorry, you cannot be added to the conference at this time. Please try again later.' })
    const percl = new PerclScript({ commands: [say] }).build()
    res.status(200).json(percl)
  } else {
    const say = new Say({ text: 'You will be added to the conference momentarily.' })
    const makeOrAddToConfScript = makeOrAddToConference(room, digits, callId)
    const percl = new PerclScript({ commands: [say, makeOrAddToConfScript] }).build()
    res.status(200).json(percl)
  }
})

function makeOrAddToConference(room, roomCode, callId) {
  if (room.conferenceId == null) {
    // If a conference has not been created for this room yet, return a CreateConference PerCL command
    room.isConferencePending = true
    room.canConferenceTerminate = false
    // Create CreateConference PerCL command
    return new CreateConference({
      actionUrl: `${host}/conferenceCreated/${roomCode}`,
      statusCallbackUrl: `${host}/conferenceStatus/${roomCode}`
    })
  } else {
    // If a conference has been created and the actionUrl callback has been called, return a AddToConference PerCL command
    return new AddToConference({ conferenceId: room.conferenceId, callId })
  }
}

app.post('/conferenceCreated/:roomCode', (req, res) => {
  const roomCode = req.params.roomCode
  const conferenceCreatedResponse = req.body
  const conferenceId = conferenceCreatedResponse.conferenceId
  const callId = conferenceCreatedResponse.callId
  // find which conference room the newly created conference belongs to
  const room = conferenceRooms.get(roomCode)

  if (room === undefined) {
    // Handle case where callback is called for a room that does not exist
  }

  room.conferenceId = conferenceId
  room.isConferencePending = false
  // Create AddToConference PerCL command
  const addToConference = new AddToConference({ conferenceId, callId })
  const percl = new PerclScript({ commands: [addToConference] }).build()
  res.status(200).json(percl)
})

app.post('/conferenceStatus/:roomCode', (req, res) => {
  const roomCode = req.params.roomCode
  const conferenceStatusResponse = req.body
  const status = conferenceStatusResponse.status
  const conferenceId = conferenceStatusResponse.conferenceId

  // find which conference room the conference belongs to
  const room = conferenceRooms.get(roomCode)

  if (room === undefined) {
    // Handle case where callback is called for a room that does not exist
  }

  if (status === 'empty' && room.canConferenceTerminate) {
    terminateConference(conferenceId)
  }
  // after first EMPTY status update conference can be terminated
  room.canConferenceTerminate = true
  res.status(200)
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

function terminateConference(conferenceId) {
  // Create the UpdateConferenceRequest and set the status to terminated
  freeclimb.updateAConference(conferenceId, new UpdateConferenceRequest({ status: 'terminated' }))
}

app.listen(port, () => {
  console.log(`Starting server on port ${port}`)
})

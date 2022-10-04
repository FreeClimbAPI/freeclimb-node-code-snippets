require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { Say, Pause, PerclScript, GetDigits, Hangup } = require('@freeclimb/sdk')

const app = express()
app.use(bodyParser.json())
const port = process.env.PORT || 80
// Where your app is hosted ex. www.myapp.com
const host = process.env.HOST

// Handles incoming calls
app.post('/incomingCall', (req, res) => {
  // Create PerCL say script
  const greeting = new Say({ text: 'Hello' })
  // Create PerCL say script
  const greetingPause = new Pause({ length: 100 })
  // Create PerCL say script
  const promptForColor = new Say({ text: 'Please select a color. Enter one for green, two for red, and three for blue.' })
  // Create options for getDigits script
  const options = {
    prompts: freeclimb.percl.build(promptForColor),
    maxDigits: 1,
    minDigits: 1,
    flushBuffer: true
  }
  // Create PerCL for getDigits script
  const getDigits = new GetDigits({ actionUrl: `${host}/colorSelectionDone`, prompts: [promptForColor], maxDigits: 1, minDigits: 1, flushBuffer: true })
  // Build and respond with Percl script
  const percl = new PerclScript({ commands: [greeting, greetingPause, getDigits] }).build()
  res.status(200).json(percl)
})

app.post('/colorSelectionDone', (req, res) => {
  // Get freeclimb response
  const getDigitResponse = req.body
  // Get the digits the user entered
  const digits = getDigitResponse.digits
  // Create PerCL say script based on the selected DTMF with US English as the language
  if (digits) {
    colors = {
      '1': 'green',
      '2': 'red',
      '3': 'blue'
    }
    const color = colors[digits]
    let sayResponse = color ? `You selected ${color}` : 'you did not select a number between 1 and 3'
    let say = new Say({ text: sayResponse })
    // Create PerCL hangup script
    const hangup = new Hangup({})
    // Build PerCL script
    const percl = new PerclScript({ commands: [say, hangup] }).build()
    // Repsond with PerCL scripts
    res.status(200).json(percl)
  }
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Starting server on port ${port}`)
})

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { Say, Pause, Hangup, PerclScript } = require('@freeclimb/sdk')

app.use(bodyParser.json())
const port = process.env.PORT || 80

// Handles incoming calls
app.post('/incomingCall', (req, res) => {

  // Create PerCL say script 
  const say = new Say({ text: 'Hello. Thank you for invoking the accept incoming call tutorial.' })

  // Create PerCL pause script with a duration of 100 milliseconds
  const pause = new Pause({ length: 100 })

  // Create PerCL say script
  const sayGoodbye = new Say({ text: 'Goodbye' })

  // Create PerCL hangup script
  const hangup = new Hangup({})

  // Build scripts
  const percl = new PerclScript({ commands: [say, pause, sayGoodbye, hangup] })

  // Convert PerCL container to JSON and append to response
  res.status(200).json(percl.build())
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Starting server on port ${port}`)
})

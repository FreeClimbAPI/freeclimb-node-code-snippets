require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { DefaultApi, createConfiguration, Enqueue, PerclScript, Say, GetDigits, Dequeue, Redirect } = require('@freeclimb/sdk')

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
  const options = {
    alias: 'Test',
    maxSize: 25
  }
  //Invoke method to create a queue with the options provided
  freeclimb.createAQueue(options).then(queue => {
    // use created queue
    const enqueue = new Enqueue({
      queueId: queue.queueId,
      actionUrl: `${host}/inboundCallAction`,
      waitUrl: `${host}/inboundCallWait` 
    })
    const percl = new PerclScript({ commands: [enqueue] }).build()
    res.status(200).json(percl)
  }).catch(err => { /* Handle Errors */ })
})

app.post('/inboundCallWait', (req, res) => {
  const queueId = req.params.queueId
  const callId = req.body.callId

  // Create PerCL say script
  const say = new Say({ text: 'Press any key to exit queue.' })
  // Create options for getDigits script
  const prompts = [say]
  const options = {
    prompts,
    maxDigits: 1,
    minDigits: 1,
    flushBuffer: true
  }
  // Create PerCL for getDigits script
  const getDigits = new GetDigits({ actionUrl: `${host}/callDequeue`, ...options })
  // Build and respond with Percl script
  const percl = new PerclScript({ commands: [getDigits] }).build()
  res.status(200).json(percl)
})

app.post('/callDequeue', (req, res) => {
  const getDigitsResponse = req.body
  const digits = getDigitsResponse.digits
  if (digits && digits.length > 0) {
    const dequeue = new Dequeue({})
    const percl = new PerclScript({ commands: [dequeue] }).build()
    res.status(200).json(percl)
  } else {
    const redirect = new Redirect({ waitUrl: `${host}/inboundCallWait` })
    const percl = new PerclScript({ commands: [redirect] }).build()
    res.status(200).json(percl)
  }
})

app.post('/inboundCallAction', (req, res) => {
  const say = new Say({ text: 'Call exited queue' })
  const percl = new PerclScript({ commands: [say] }).build()
  res.status(200).json(percl)
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log('Listening on port ' + port)
})

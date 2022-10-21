require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const { createConfiguration, DefaultApi, Sms, PerclScript } = require('@freeclimb/sdk')

const port = process.env.PORT || 80
const host = process.env.HOST
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

app.post('/incomingCall', (req, res) => {
  // Create sms PerCL that sends sms to current caller using the number handling the request
  const smsCommand = new Sms({
    to: req.body.to,
    _from: req.body.from,
    text: 'Incoming Phone Call',
    notificationUrl: `${host}/notificationUrl`
  })
  const percl = new PerclScript({ commands: [smsCommand] }).build()
  res.status(200).json(percl)
})

// Receive status updates of the sms
app.post('/notificationUrl', (req, res) => {
  console.log('Outbound Message Status Change: ', req.body)
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Starting server on ${port}`)
})

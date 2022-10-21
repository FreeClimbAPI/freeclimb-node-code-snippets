require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const { createConfiguration, DefaultApi, MessageRequest } = require('@freeclimb/sdk')

const port = process.env.PORT || 80
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

app.post('/incomingSms', (req, res) => {
  const toNumber = 'example to number'
  const fromNumber = 'example from number'

  freeclimb.sendAnSmsMessage(new MessageRequest({ _from: fromNumber, to: toNumber, text: 'Hey! It is your application!' })).catch(err => {console.log(err)})
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Starting server on ${port}`)
})

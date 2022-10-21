require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const { createConfiguration, DefaultApi, MakeCallRequest, GetSpeech, Say, PerclScript, Hangup }= require('@freeclimb/sdk')

const port = process.env.PORT || 80
const host = process.env.HOST
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const applicationId = process.env.APPLICATION_ID
const TO_NUMBER = process.env.TO_NUMBER
const FROM_NUMBER = process.env.FROM_NUMBER

const freeclimb = new DefaultApi(createConfiguration({ accountId, apiKey }))

//Invoke create method to initiate the asynchronous outdial request
freeclimb.makeACall(new MakeCallRequest({ to: TO_NUMBER, _from: FROM_NUMBER, applicationId })).catch(err => console.error(err))

// Handles incoming calls. Set with 'Call Connect URL' in App Config
app.post('/incomingCall', (req, res) => {
  const say = new Say({ text: "Please select a color. Select green, red, or yellow." })
  const getSpeech = new GetSpeech({ actionUrl: `${host}/colorSelectDone`, grammarFile: `${host}/grammarFile`, grammarType: "URL", prompts: [say] })
  const percl = new PerclScript({ commands: [getSpeech] }).build()
  // Convert PerCL container to JSON and append to response
  res.status(200).json(percl)
})

app.post('/colorSelectDone', (req, res) => {
  const getSpeechActionResponse = req.body
  let say
  // Check if recognition was successful
  if (getSpeechActionResponse.reason === 'recognition') {
    // Get the result
    const color = getSpeechActionResponse.recognitionResult
    say = new Say({ text: `Selected color was ${color}` })
  } else {
    say = new Say({ text: 'There was an error in selecting a color' })
  }
  const hangup = new Hangup({})
  const percl = new PerclScript({ commands: [say, hangup] }).build()
  res.status(200).json(percl)
})

app.get('/grammarFile', function (req, res) {
  const file = `${__dirname}/colorGrammar.xml`
  res.download(file)
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Starting server on port ${port}`)
})

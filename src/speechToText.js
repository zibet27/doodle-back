const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1")
const { IamAuthenticator } = require("ibm-watson/auth")
const fs = require("fs")

require("dotenv").config()

const speechToText = new Promise((resolve, reject) => {

    const speechToText = new SpeechToTextV1({
        authenticator: new IamAuthenticator({
            apikey: process.env.IBM_API_KEY,
        }),
        url: process.env.IBM_URL,
    })

    const params = {
        objectMode: true,
        contentType: 'audio/mp3',
        model: 'en-GB_BroadbandModel',
        splitTranscriptAtPhraseEnd: true
    }

    // Create the stream.
    const recognizeStream = speechToText.recognizeUsingWebSocket(params);

    // Pipe in the audio.
    fs.createReadStream("audio/speech.mp3").pipe(recognizeStream);

    recognizeStream.on("data", function (event) {
        resolve(event.results[0].alternatives[0].transcript)
    })

    recognizeStream.on("error", function (event) {
        if (event.message) reject(event.message)
    })
})

module.exports = speechToText

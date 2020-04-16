const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1")
const {IamAuthenticator} = require("ibm-watson/auth")
const fs = require("fs")

require("dotenv").config()

const speechToText = (resolve, reject) => {
    const speechToText = new SpeechToTextV1({
        authenticator: new IamAuthenticator({
            apikey: process.env.IBM_API_KEY,
        }),
        url: process.env.IBM_URL,
    })

    const params = {
        objectMode: true,
        contentType: "audio/webm;codecs=opus",
        model: 'en-GB_BroadbandModel',
    }

    // Create the stream.
    const recognizeStream = speechToText.recognizeUsingWebSocket(params)

    // Pipe in the audio.
    fs.createReadStream("audio/speech.webm").pipe(recognizeStream)

    recognizeStream.on("data", function (event) {
        resolve(event.results[0].alternatives[0].transcript)
    })

    recognizeStream.on("error", function (event) {
        if (event.message) reject(event.message)
    })
    recognizeStream.on("close", function (event) {
        console.log("close:", event)
    })
}

module.exports = speechToText
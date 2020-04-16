const app = require("express")()
const bodyParser = require("body-parser")
const multer = require("./multer")
const fs = require("fs")
const speechToText = require("./speechToText")

require("dotenv").config()

app.use(bodyParser.json())
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')
    next()
})

app.post("/speech", multer.single("audio"), (req, res) => {
    const audio = req.file

    const resHandler = (statusCode, status, eMessage) => res.status(statusCode).json({status: status, message: eMessage})

    if (!audio) {
        return resHandler(403, "error", "Please add correct audio file")
    }

    try {
        const fileName = "audio/speech.webm"

        fs.writeFileSync(fileName, audio.buffer)

        new Promise(speechToText)
            .then(text => {
                console.log(text)
                resHandler(200, "success", text)
                fs.unlinkSync(fileName)
            })
            .catch(e => {
                console.log(e)
                resHandler(500, "error", e)
                fs.unlinkSync(fileName)
            })
    } catch (e) {
        resHandler(500, "error", e.message)
    }
})

app.listen(process.env.PORT, () => console.log("Server started on PORT 3003"))



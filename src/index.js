const speechToText = require("./speechToText")
const http = require("http")
const fs = require("fs")

require("dotenv").config()

http.createServer((req, res) => {

    const resHandler = (statusCode, status, eMessage) => {
        res.statusCode = statusCode
        res.write(JSON.stringify({
            status: status, message: eMessage
        }))
        res.end()
    }

    if (req.method === "POST" && req.url === "/speech") {
        req.on("data", async (audio) => {

            if (!audio) {
                return resHandler(403, "error", "Please add correct audio file")
            }

            try {
                const fileName = "audio/speech.mp3";

                if (fs.existsSync(fileName)) fs.unlinkSync(fileName);

                fs.writeFileSync(fileName, Buffer.from(new Uint8Array(audio)))
                
                speechToText
                .then((text) => resHandler(200, "success", text))
                .catch((e) => resHandler(500, "error", e.message))

            } catch (e) {
                resHandler(500, "error", e.message)
            }
        })

        req.on("error", (e) => {
            resHandler(400, "error", e.message)
        })
    } else {
        resHandler(404, "error", "Please use correct endpoint")
    }
}).listen(process.env.PORT || 3003, () => console.log("Server started on PORT 3003"))



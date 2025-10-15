const express = require("express")

const app = express()
const PORT = 3000

const URL = "https://hdocsbot.onrender.com"

app.get("/wakeup", (req, res) => {
    res.send("wake")
})

app.listen(PORT, () => {
    console.log("wakeup running")
})

function wakeup() {
    fetch(`${URL}/wakeup`)
    setTimeout(() => wakeup(), 60_000)
}

setTimeout(() => wakeup(), 60_000)

module.exports = {}
const express = require("express")
const fs = require("fs")

const data = require("./api.json")


const app = express()
const PORT = 3000

const URL = "https://hdocsbot.onrender.com"

app.get("/wakeup", (req, res) => {
    res.send("ok")
})

app.get("/visit", (req, res) => {
    data.visits++
    res.send("ok")
})

app.listen(PORT, () => {
    console.log("wakeup running")
})

async function loop() {
    fetch(`${URL}/wakeup`)
    fs.writeFileSync("./api/api.json", JSON.stringify(data))
    setTimeout(() => loop(), 60_000)
}

function getVisits() {
    return data.visits
}

setTimeout(() => loop(), 60_000)

module.exports = {
    getVisits
}
const express = require("express")
const fs = require("fs")

const data = require("./api.json")
const visits = data.visits



const app = express()
const PORT = 3000

const URL = "https://hdocsbot.onrender.com"

app.get("/wakeup", (req, res) => {
    res.send("ok")
})

app.get("/visit", (req, res) => {
    try {
        visits++
        res.send("ok")
    } catch(e) {
        console.log(e)
    }
})

app.listen(PORT, () => {
    console.log("wakeup running")
})

function loop() {
    fetch(`${URL}/wakeup`)
    fs.writeFileSync("./api.json", JSON.stringify(data))
    setTimeout(() => loop(), 60_000)
}

function getVisits() {
    return visits
}

setTimeout(() => loop(), 60_000)

module.exports = {
    getVisits
}
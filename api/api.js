const express = require("express")
const fs = require("fs")

let data = {
    visits: 0
}

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

async function loop(message) {
    fetch(`${URL}/wakeup`)

    message.edit(JSON.stringify(data))

    setTimeout(() => loop(message), 60_000)
}

async function start(client) {

    const channel = client.channels.cache.get('1428736541693579366')
    const message = (await channel.messages.fetch({ limit: 1 })).first()

    data = JSON.parse(message.content)

    setTimeout(() => loop(message), 60_000)
}

function getVisits() {
    return data.visits
}


module.exports = {
    start,
    getVisits
}
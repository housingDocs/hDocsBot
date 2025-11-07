const fs = require("node:fs");
const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json")

function getFiles(dir) {

    const files = fs.readdirSync(dir, {
        withFileTypes: true
    })
    let commandFiles = [];

    for (const file of files) {
        if (file.isDirectory()) {
            commandFiles = [
                ...commandFiles,
                ...getFiles(`${dir}/${file.name}`)
            ]
        } else if (file.name.endsWith(".js")) {
            commandFiles.push(`${dir}/${file.name}`)
        }
    }
    return commandFiles;
}

let localCommands = []
let globalCommands = []

const localFiles = getFiles("./commands/local")
const globalFiles = getFiles("./commands/global")

console.log(localFiles)

for (const file of localFiles) {
    const command = require(file)
    localCommands.push(command.data.toJSON())
}

for (const file of globalFiles) {
    const command = require(file)
    globalCommands.push(command.data.toJSON())
}

const rest =  new REST({ version: "10" }).setToken(token);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: localCommands })
    .then(() => console.log("Build local commands succesfully!"))
    .catch(console.error)

rest.put(Routes.applicationGuildCommands(clientId), { body: globalCommands })
    .then(() => console.log("Build global commands succesfully!"))
    .catch(console.error)

module.exports = {}
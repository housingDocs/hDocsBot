const { ActivityType } = require('discord.js')
const { getVisits } = require("../api/api")

function handleStatus(client) {
    client.user.setPresence({ 
        activities: [{ 
            name: `${getVisits()} visits`, 
            type: ActivityType.Watching, 
        }], 
        status: 'online' 
    })

    setTimeout(() => handleStatus(client), 60_000)
}

module.exports = handleStatus
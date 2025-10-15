const { ActivityType } = require('discord.js')

function handleStatus(client) {
    client.user.setPresence({ 
    activities: [{ 
        name: '⏱️ Waiting for something', 
        type: ActivityType.Listening, 
    }], 
    status: 'online' 
})
}

module.exports = handleStatus
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { token, channels } = require("./config.json")
const fs = require("node:fs")
const DBClient = require("./db/DBClient.js")

const db = new DBClient()

require("./deploy-commands.js")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences
    ],
});

client.commands = getCommands("./commands");

client.logQueue = []

client.log = async () => {
    if (client.logQueue.length) client.logChannel.send(`\`\`\`ansi\n${client.logQueue.join("\n")}\n\`\`\``)
    client.logQueue = []
}

client.logInteraction = async (interaction) => {
    client.logQueue.push(`\u001b[0;1;31m${interaction.customId ? "Button" : "Interaction"} \u001b[0;1m${interaction.customId ? interaction.customId : interaction}\u001b[0;31m ran by \u001b[0;1m${interaction.user.tag} \u001b[0;34m[${interaction.user.id}] \u001b[0;31min \u001b[0;1m${interaction.guild.name}`)
}

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user.tag}`);

    client.logChannel = client.channels.cache.get(channels.log)
    client.welcomeChannel = client.channels.cache.get(channels.welcome)

    require("./other/status.js")(client)
    require("./api/api.js").start(client)
    
    setTimeout(loopLog, 30_000)
});

client.on(Events.InteractionCreate, (interaction) => {

    try {

        console.log(`Interaction: ${interaction.customId || interaction} | ran by ${interaction.user.tag} or ${interaction.user.id} | in ${interaction.guild.name}`)
        client.logInteraction(interaction)

        if (!interaction.isChatInputCommand()) {
            buttons({interaction, client })
            return
        }

        let command = client.commands.get(interaction.commandName);

        try{
            if(interaction.replied) return;
            command.execute({ interaction, client, db });
        } catch (error) {
            console.error(error);
        }
    } catch(e) {
        client.log(e)
        console.log(e)
    }

});

client.on(Events.GuildMemberAdd, (member) => {
    client.welcomeChannel.send(`:hand_splayed: Welcome <@${member.id}> to the **hDocs Discord server**!`)
})

client.login(token);

function buttons(stuff) {

    if (stuff.interaction.customId) {

        client.commands.get(stuff.interaction.customId.split(":")[0]).buttons(stuff)

    }
}

function getCommands(dir) {
    let commands = new Collection();
    const commandFiles = getFiles(dir)

    for (const commandFile of commandFiles) {
        const command = require(commandFile);
        commands.set(command.data.toJSON().name, command)
    }
    return commands;
}

function getFiles(dir) {

    const files = fs.readdirSync(dir, {
        withFileTypes: true
    })
    let commandFiles = [];

    for (const file of files) {
        if(file.isDirectory()) {
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

function loopLog() {
    client.log()
    setTimeout(loopLog, 30_000)
}



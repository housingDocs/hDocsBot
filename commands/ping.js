const { SlashCommandBuilder } = require("discord.js")
const ResponseBuilder = require("../util/ResponseBuilder")
const { MessageFlags } = require("discord-api-types/v10");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pings the bot"),

    async execute(stuff) {
        const { interaction } = stuff
        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [
                ResponseBuilder.success("Pong!")
            ]
        })
    }
}
const { SlashCommandBuilder, MessageFlags } = require("discord.js")
const ResponseBuilder = require("../../util/ResponseBuilder")

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
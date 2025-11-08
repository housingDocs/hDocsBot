const { SlashCommandBuilder, MessageFlags } = require("discord.js")
const ResponseBuilder = require("../../util/ResponseBuilder")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("View this bot's features"),
    
    async execute(stuff) {
        const { interaction } = stuff

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: ResponseBuilder.help()
        })
    }
}
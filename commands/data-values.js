const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const ResponseBuilder = require("../util/ResponseBuilder")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("data-values")
        .setDescription("View a list of data values")

        .addStringOption((option) => 
            option
                .setName("search")
                .setDescription("Optional search query")
                .setRequired(false)),

    async execute(stuff) {
        const { interaction } = stuff
        const search = interaction.options.getString("search")

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: ResponseBuilder.dataValues(search ? search : "")
        })
    }
}
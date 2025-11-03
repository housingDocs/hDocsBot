const { SlashCommandBuilder, MessageFlags } = require("discord.js")
const ResponseBuilder = require("../util/ResponseBuilder")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("top-pages")
        .setDescription("View the top pages ranked by rating")

        .addNumberOption((option) =>
            option
                .setName("amount")
                .setDescription("Amount of pages to display")
                .setRequired(true)

                .addChoices([5, 10, 20].map((n) => ({ name: `${n}`, value: n })))
        ),
    
    async execute(stuff) {
        const { interaction, db } = stuff

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        })

        const amount = interaction.options.getNumber("amount")
        const data = await db.getTopRatedPages(amount)

        return await interaction.editReply({
            embeds: [
                ResponseBuilder.topRatedPages(data)
            ]
        })
    }
}
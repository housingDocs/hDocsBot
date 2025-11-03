const { SlashCommandBuilder, MessageFlags } = require("discord.js")
const ResponseBuilder = require("../util/ResponseBuilder")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("format-codes")
        .setDescription("View the formatting codes for housing text")
        
        .addStringOption((option) => 
            option
                .setName("display")
                .setDescription("Choose the content to be displayed")
                .addChoices([
                    { name: "color", value: ResponseBuilder.FORMAT_OPTIONS.COLOR },
                    { name: "format", value: ResponseBuilder.FORMAT_OPTIONS.FORMAT },
                    { name: "all", value: ResponseBuilder.FORMAT_OPTIONS.ALL }
                ]))
        ,
    
    async execute(stuff) {
        const { interaction } = stuff
        const display = interaction.options.getString("display")

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [
                ResponseBuilder.formatCodes(display ? display : ResponseBuilder.FORMAT_OPTIONS.ALL)
            ]
        })
    }
}
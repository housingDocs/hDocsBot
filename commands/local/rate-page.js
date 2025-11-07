const { SlashCommandBuilder, MessageFlags } = require("discord.js")
const ResponseBuilder = require("../../util/ResponseBuilder")

const PAGES = Object.freeze({

    "Home": [
        "Docs Introduction",
        "What is Housing",
        "Housing Genres"
    ],

    "General Housing": [
        "Housing Browser",
        "Item Editor",
        "Formatting Codes",
        "Data Values",
        "Cookies",
        "Housing+"
    ],

    "Housing Menu": [
        "Groups and Permissions",
        "Pro Tools",
        "Block IDs",
        "Special Items",
        "NPCs",
        "Jukebox"
    ],

    "House Settings": [
        "Plot Size",
        "Themes"
    ],

    "Systems": [
        "Edit Actions",
        "Variables & Placeholders",
        "Functions",
        "Custom Menus",
        "Custom Commands",
        "Regions",
        "Event Actions",
        "Scoreboard Editor",
        "Layouts",
        "Teams"
    ],

    "HTSL": [
        "HTSL Introduction",
        "Code Block Editor",
        "HTSL Forum"
    ],
    "Contribute": [
        "Contribute",
        "Article Markdown",
        "Article Editor"
    ],

    "Other": [
        "About"
    ]
})

const cmd = new SlashCommandBuilder()
    .setName("rate-page")
    .setDescription("Rate a page on a scale 1 through 5")

Object.entries(PAGES).forEach(([header, pages]) => {
    const choices = pages.map((p) => 
        ({ name: p, value: p })
    )

    const s = (subCommand) =>
        
        subCommand
            .setName(header.toLowerCase().replaceAll(" ", "_"))
            .setDescription(header)
        
            .addStringOption((option) =>
                option
                    .setName("page")
                    .setDescription("The page you want to rate")
                    .setRequired(true)

                    .addChoices(choices)
                )
            
            .addNumberOption((option) => 
                option
                    .setName("rating")
                    .setDescription("Your rating")
                    .setRequired(true)

                    .addChoices([1, 2, 3, 4, 5].map((n) => ({
                        name: `${n}`, value: n
                    })))
            )

    cmd.addSubcommand(s)
})

module.exports = {
    data: cmd,

    async execute(stuff) {
        const { interaction, db } = stuff
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        })

        const pageIdentifier = interaction.options.getSubcommand() + "/" + interaction.options.getString("page")

        console.log(pageIdentifier)

        const dbRes = await db.ratePage(interaction.user.id, pageIdentifier, interaction.options.getNumber("rating"))
        if (dbRes === true) {
            return await interaction.editReply({
                embeds: [ResponseBuilder.success(`Rated page \`${pageIdentifier}\` successfully`)]
            })
        }

        try {
            if (dbRes.dberror) {
                return await interaction.editReply({
                    embeds: [ResponseBuilder.error(dbRes.message)]
                })
            }
        } catch(e) {
            return await interaction.editReply({
                embeds: [ResponseBuilder.error("yea idk ping me if this happened")]
            })
        }

        return interaction.reply({
            content: "e",
            flags: MessageFlags.Ephemeral
        })
    }
}
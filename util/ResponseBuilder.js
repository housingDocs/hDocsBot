const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require("discord.js")

const { colors, format } = require("./data.json").format
const { dataValues, blockIds } = require("./data.json")

class ResponseBuilder {

    static FORMAT_OPTIONS = Object.freeze({
        COLOR: "COLOR",
        FORMAT: "FORMAT",
        ALL: "ALL"
    })

    static EMBED_MAX_FIELDS = 24

    static success(message) {
        return new EmbedBuilder()
            .setTitle(":white_check_mark: Success")
            .setDescription(message)
            .setColor("Green")
    }

    static warning(message) {
        return new EmbedBuilder()
            .setTitle(":warning:")
            .setDescription(message)
            .setColor("Yellow")
    }

    static error(message = "An error occured!") {
        return new EmbedBuilder()
            .setTitle(":x: Error")
            .setDescription(message)
            .setColor("Red")
    }

    static formatCodes(options = FORMAT_OPTIONS.ALL) {
        let code = ""
        let effect = ""

        if (options === this.FORMAT_OPTIONS.ALL || options === this.FORMAT_OPTIONS.COLOR) {
            for (const c of colors) {
                code += `\`${c.code}\`` + "\n"
                effect += c.name + "\n"
            }
            code += "\n"
            effect += "\n"
        }

        
        if (options === this.FORMAT_OPTIONS.ALL || options === this.FORMAT_OPTIONS.FORMAT) {
            for (const f of format) {
                code += `\`${f.code}\`` + "\n"
                effect += f.name + "\n"
            }
        }

        return this.postProcess(new EmbedBuilder()
            .setTitle("Formatting Codes")
            .setDescription("List of all format codes usable in Housing\nFull article [here](https://housingdocs.github.io/html/General_Housing/Formatting_Codes.html)")

            .addFields([
                {
                    name: "Code",
                    value: code,
                    inline: true
                },
                {
                    name: "Effect",
                    value: effect,
                    inline: true
                }
            ]))
    }

    static dataValues(search = "") {
        const searched = {}
        const fields = []

        for (const [group, content] of Object.entries(dataValues)) {
            let displayGroup = false

            for (const entry of content) {
                if (!entry.name.toLowerCase().includes(search.toLowerCase())) continue

                if (!displayGroup) {
                    searched[group] = [ entry ]
                    displayGroup = true
                } else {
                    searched[group].push(entry)
                }
            }
        }

        for (const [group, content] of Object.entries(searched)) {
            let names = ""
            let values = ""

            for (const { name, value } of content) {
                names += name + "\n"
                values += value + "\n"
            }

            fields.push(
                {
                    name: group,
                    value: names,
                    inline: true
                },
                {
                    name: "\u200B",
                    value: values,
                    inline: true
                },
                { name: "\u200B", value: "\u200B", inline: true }
            )
        }

        if (fields.length === 0) {
            return [ this.error(`No results found for search "${search}". View the full list [here](https://housingdocs.github.io/html/General_Housing/Data_Values.html)`) ]
        }

        const embeds = this.chunkArray(fields, this.EMBED_MAX_FIELDS).map((chunk) =>
            this.postProcess(
                new EmbedBuilder()
                    .setTitle("Data Values")
                    .setDescription("List of all data values\nFull article [here](https://housingdocs.github.io/html/General_Housing/Data_Values.html)")
                    .addFields(chunk)
            )
        )

        return embeds
    }

    static blockIds(search = "") {
        let blocks = ""
        let ids = ""

        for (const b of blockIds) {
            if (b.name.toLowerCase().includes(search)) {
                blocks += b.name + "\n"
                ids += b.id + "\n"
            }
        }

        if (blocks.length === 0) {
            return this.error(`No results found for search "${search}". View the full list [here](https://housingdocs.github.io/html/Housing_Menu/Block_IDs.html)`)
        }

        const embed = new EmbedBuilder()
            .setTitle("Block IDs")
            .setDescription("List of all block IDs\nFull article [here](https://housingdocs.github.io/html/Housing_Menu/Block_IDs.html)") // TODO
            .addFields([
                { name: "Block", value: blocks, inline: true },
                { name: "ID", value: ids, inline: true },
                { name: "\u200B", value: "\u200B", inline: true }
            ])
        
        return this.postProcess(embed)
    }

    static topRatedPages(data) {
        const embed = new EmbedBuilder()
            .setTitle("Top rated Pages")
            .setDescription("View a list of the top rated pages")

        const fields = [
            { name: "Page", value: "", inline: true },
            { name: "Rating", value: "", inline: true }
        ]

        data.forEach(d => {
            fields[0].value += d.name + "\n"
            fields[1].value += d.rating + "\n"
        })

        return this.postProcess(embed.addFields(fields))
    }

    static postProcess(embed) {
        embed.setColor("#6341e0")
        embed.setFooter({
            text: "hDocs",
            iconURL: "https://cdn.discordapp.com/avatars/1427676116386054178/8d5bf0ff0e23f8e70041aedf43f2b3ef.webp?size=240"
        })
        embed.setTimestamp()

        return embed
    }

    static chunkArray(arr, size) {
        const chunks = []
        for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))

        return chunks
    }

}

module.exports = ResponseBuilder
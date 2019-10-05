const { getMember, formatDate } = require("../../functions.js");
const { RichEmbed } = require("discord.js");

module.exports = {
    name: "help",
    category: "info",
    description: "Returns the server info",
    run: async (client, message, args) => {
        const member = getMember(message, args.join(" "));

        const embed = new RichEmbed()
            .setTitle("Commands")
            .setColor("#6495ed")
            .setDescription("The following is a list of bot commands organized into their appropriate category.")
            .addField("Information", "`help`, `whois`, `ping`")
            .addField("Moderation", "`kick`, `ban`, `report`")
            .addField("Posting", "`say`, `say embed`")
            .addField("Support Server", "`https://discord.gg/jvW6nHd`")
            .setFooter("Developed by TotallyNotArchie#0001")

            .setTimestamp()

                message.channel.send(embed);
    }
}
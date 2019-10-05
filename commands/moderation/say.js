const { getMember, formatDate } = require("../../functions.js");
const { RichEmbed } = require("discord.js");

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    category: "moderation",
    description: "Says your input via the bot",
    usage: "<input>",
    run: async (client, message, args) => {
        const member = getMember(message, args.join(" "));
        if (message.deletable) message.delete();
        
        if (args.length < 1)
           return message.reply("Please provide something for Testbot to say.").then(m => m.delete(5000));

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setFooter(member.displayName, member.user.displayAvatarURL)
                .setTimestamp()

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}
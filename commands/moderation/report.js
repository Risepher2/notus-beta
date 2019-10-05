const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    category: "moderation",
    description: "Reports a member",
    usage: "<mention, id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.reply("Unable to find that user.").then(m => m.delete(5000));

        if (rMember.hasPermission("MANAGE_MESSAGES") || rMember.user.bot)
            return message.channel.send("Unable to report that user.").then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send("Please specify a reason to report that user..").then(m => m.delete(5000));
        
        const channel = message.guild.channels.find(c => c.name === "reports")
            
        if (!channel)
            return message.channel.send("Unable find a `#reports` channel. Please contact a server administrator to create one.").then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#6495ed")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Report")
            .setDescription(stripIndents`**Reported User:** ${rMember} (${rMember.user.id})
            **Reported By:** ${message.member} (${message.member.id})
            **Reported In:** ${message.channel}
            **Reason:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}
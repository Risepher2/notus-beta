const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["userinfo"],
    category: "info",
    description: "Returns user information",
    usage: "[username | id | mention]",
    run: (client, message, args) => {
        const member = getMember(message, args.join(" "));

        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        const created = formatDate(member.user.createdAt);

        const embed = new RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Member information:', stripIndents`**Display Name:** ${member.displayName}
            **Joined at:** ${joined}
            **Roles:** ${roles}`, true)

            .addField('User information:', stripIndents`**User ID:** ${member.user.id}
            **Username**: ${member.user.username}
            **Tag**: ${member.user.tag}
            **Registered at**: ${created}`, true)
            
            .setTimestamp()

        if (member.user.presence.game) 
            embed.addField('Currently Playing', stripIndents`**Name:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}
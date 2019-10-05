const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kicks the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "mod-logs") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("Please specify a user to kick.")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("Please specify a reason to kick that user.")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("You do not have the KICK_MEMBERS permission.")
                .then(m => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("I do not have the KICK_MEMBERS permission. Please contact a server administrator.")
                .then(m => m.delete(5000));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toKick) {
            return message.reply("Unable to find that user.")
                .then(m => m.delete(5000));
        }

        if (toKick.id === message.author.id) {
            return message.reply("You cannot kick yourself.")
                .then(m => m.delete(5000));
        }

        if (!toKick.kickable) {
            return message.reply("Unable to kick that user.")
                .then(m => m.delete(5000));
        }
                
        const embed = new RichEmbed()
            .setColor("#6495ed")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.guild.name)
            .setTimestamp()
            .setDescription(stripIndents`**Kicked member:** ${toKick} (${toKick.id})
            **Kicked by:** ${message.member} (${message.member.id})
            **Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("#6495ed")
            .setAuthor(`This verification will be invalid after 30 seconds.`)
            .setDescription(`Do you want to kick ${toKick}?`)

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Kick failed, error: ${err}.`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Kick has been cancelled.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
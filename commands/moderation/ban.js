const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "moderation",
    description: "bans the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "mod-logs") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("Please specify a user to ban.")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("Please specify a reason to ban that user.")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("You do not have the BAN_MEMBERS permission.")
                .then(m => m.delete(5000));
        
        
            }
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("I do not have the BAN_MEMBERS permission. Please contact a server administrator.")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toBan) {
            return message.reply("Unable to find that user.")
                .then(m => m.delete(5000));
        }

        if (toBan.id === message.author.id) {
            return message.reply("You cannot ban yourself.")
                .then(m => m.delete(5000));
        }

        if (!toBan.bannable) {
            return message.reply("Unable to ban that user.")
                .then(m => m.delete(5000));
        }
        
        const embed = new RichEmbed()
            .setColor("#6495ed")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.guild.name)
            .setTimestamp()
            .setDescription(stripIndents`**Banned member:** ${toBan} (${toBan.id})
            **Banned by:** ${message.member} (${message.member.id})
            **Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("#6495ed")
            .setAuthor(`This verification will be invalid after 30 seconds.`)
            .setDescription(`Do you want to ban ${toBan}?`)

        await message.channel.send(promptEmbed).then(async msg => {

            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Ban failed, error: ${err}`)
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
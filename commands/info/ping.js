module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Pinging...`);

        msg.edit(`Pong! Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
}
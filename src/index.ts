
const config:Configuration = require("../config.json");
import { setInterval } from "timers";
import { Api } from "./structures/Api";
import { handleInteractions } from "./structures/handleInteractions";
import { DiscordClient } from "./structures/DiscordClient";

if(config.use_discord_bot) {
    const client = new DiscordClient(config);

    client.on("ready", () => {
        handleInteractions(client);
        client.registerCommands();
        console.log("Welcome to VintedDiscordBot\nThe bot is ready !");
        console.log(`You can invite the bot to your server with this link : \nhttps://discord.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot%20applications.commands&permissions=8`)

        if(config.fetch_at_start == true) {
            client.VintedApi.executeQueries();
        }

        setInterval(() => {
            client.VintedApi.executeQueries();
        }, config.refreshInterval)
    });


    
    client.login(config.discord_token);
} else {
    const api = new Api(config);
    if(config.fetch_at_start == true) {
        api.executeQueries();
    } 
    
    setInterval(() => {
        api.executeQueries();
    }, config.refreshInterval);
}

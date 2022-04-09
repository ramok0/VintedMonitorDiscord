
const config:Configuration = require("../config.json");
import { setInterval } from "timers";
import { VintedApi } from "./structures/VintedApi";
import { handleInteractions } from "./structures/functions/handleInteractions";
import { DiscordClient } from "./structures/DiscordClient";

if(config.use_discord_bot) {
    const client = new DiscordClient(config);
    client.on("ready", () => {
        handleInteractions(client);
        client.registerCommands();
        client.VintedApi.logger.log("Welcome to VintedDiscordBot", "INFO");
        client.VintedApi.logger.log("The bot is ready", "OK");
        client.VintedApi.logger.log(`You can invite the bot to your server with this link : \nhttps://discord.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot%20applications.commands&permissions=8`, "INFO");


        if(config.fetch_at_start == true) {
            client.VintedApi.executeQueries();
        }

        setInterval(() => {
            client.VintedApi.executeQueries();
        }, config.refreshInterval)
    });


    
    client.login(config.discord_token);
} else {
    const api = new VintedApi(config);
    if(config.fetch_at_start == true) {
        api.executeQueries();
    } 
    
    setInterval(() => {
        api.executeQueries();
    }, config.refreshInterval);
}

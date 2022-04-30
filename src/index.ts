import { Configuration } from "./structures/Configuration";
import { setInterval } from "timers";
import { VintedApi } from "./structures/VintedApi";
import { handleInteractions } from "./structures/functions/handleInteractions";
import { DiscordClient } from "./structures/DiscordClient";


var config = new Configuration(null);
if(config.use_discord_bot) {
    const client = new DiscordClient();
    config = client.VintedApi.configuration;
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


    if(!config.discord_token) {
        client.VintedApi.logger.log("Invalid Token", "ERROR");
        process.exit(1);
    }
    client.login(config.discord_token);
} else {
    const api = new VintedApi();
    if(config.fetch_at_start == true) {
        api.executeQueries();
    } 
    
    setInterval(() => {
        api.executeQueries();
    }, config.refreshInterval);
}

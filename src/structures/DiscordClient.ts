import { Awaitable, ButtonInteraction, Client, ClientEvents, Intents } from "discord.js";
import { Api } from "./Api";

export class DiscordClient extends Client {
    public VintedApi:Api;
    constructor(configuration:Configuration) {
        super({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS]});
     //   this.token = configuration.discord_token;
        this.VintedApi = new Api(configuration);
    }
}
import { Client, Collection, Intents } from "discord.js";
import { Api } from "./Api";
import { VintedBotCommand } from "./ApplicationCommandInterface";
import { Dirent, readdirSync } from "fs";
export class DiscordClient extends Client {
    public VintedApi:Api;
    public commands:Map<string, VintedBotCommand>;
    constructor(configuration:Configuration) {
        super({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS]});
        this.VintedApi = new Api(configuration);
        this.commands = new Map();
    }

    async registerCommands() {
        const files = this.getFiles("dist/structures/commands");
        files.forEach(async(file) => {
            const {default:VintedBotCommand} = await import("./commands/" + file);
            if(!VintedBotCommand) return;
            const command = new VintedBotCommand();
            this.commands.set(command.name, command);
        })

        

    }

    private getFiles(path:string):string[] {
        const result = readdirSync(path, {withFileTypes: true}).filter((dirent:Dirent) => dirent.name.endsWith(".js") && dirent.isFile()).map((dirent) => dirent.name);
        return result;
    }
}
import { CommandInteraction } from "discord.js";
import { VintedBotCommand, ApplicationCommandTypes } from "../interfaces/ApplicationCommand";
import { DiscordClient } from "../DiscordClient";
import { performance } from "perf_hooks";


export default class implements VintedBotCommand {
    name = "executequeries";
    type = ApplicationCommandTypes.CHAT_INPUT;
    description = "Execute every queries";
    execute = async(client:DiscordClient, interaction:CommandInteraction):Promise<void> => {
        interaction.reply({content: "✅"}).catch(console.warn);
        const before = performance.now();
        await client.VintedApi.executeQueries();
        const after = performance.now();
        console.log(`Executed queries in ${(after - before) / 1000} millisecondes`);
        return;
    }
}
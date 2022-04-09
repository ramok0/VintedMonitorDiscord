import { CacheType, CommandInteraction } from "discord.js";
import { VintedBotCommand, ApplicationCommandTypes } from "../ApplicationCommandInterface";
import { DiscordClient } from "../DiscordClient";
import { refreshConfiguration } from "../refreshConfiguration";

export default class implements VintedBotCommand {
    type = ApplicationCommandTypes.CHAT_INPUT;
    name = "refreshconfigurations";
    description = "Update the current config without restarting the bot";

    execute = async(client: DiscordClient, interaction: CommandInteraction<CacheType>):Promise<void> => {
        refreshConfiguration(client.VintedApi);
        interaction.reply({content: "✅ Refreshed configuration"})
    }
}
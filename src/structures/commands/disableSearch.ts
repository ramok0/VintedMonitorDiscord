import { CommandInteraction, CacheType } from "discord.js";
import fs from "fs";
import { ApplicationCommandOptionType, ApplicationCommandTypes, VintedBotCommand } from "../interfaces/ApplicationCommand";
import { DiscordClient } from "../DiscordClient";
import { refreshConfiguration } from "../functions/refreshConfiguration";


export default class implements VintedBotCommand {
    name = "disableitem";
    description = "Disable item";
    type = ApplicationCommandTypes.CHAT_INPUT;
    options = [
        {
                type: ApplicationCommandOptionType.STRING,
                name: "name",
                description: "The name that you put in the config.json file",   
                required: true
        }
    ];

    execute = async(client: DiscordClient, interaction: CommandInteraction<CacheType>):Promise<void> => {
        const name = interaction.options.getString("name", true);
        if(!name) return interaction.reply({content: ":x: | Name not found"});
        const item = client.VintedApi.configuration.items.find((item) => item.name.toLowerCase() == name.toLowerCase());
        if(!item) return interaction.reply({content: ":x: | Not found"});
        item.disabled = !item.disabled;
        fs.writeFileSync("config.json", JSON.stringify(item, null, 4));
        refreshConfiguration(client.VintedApi);
        interaction.reply({content: `:white_check_mark: | Done !\n${item.name} is now ${item.disabled ? "enabled" : "disabled"}.`})
    }
}
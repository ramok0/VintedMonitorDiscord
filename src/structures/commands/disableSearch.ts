import { CommandInteraction, CacheType } from "discord.js";
import fs from "fs";
import { ApplicationCommandOptionType, ApplicationCommandTypes, VintedBotCommand } from "../interfaces/ApplicationCommand";
import { DiscordClient } from "../DiscordClient";
import { refreshConfiguration } from "../functions/refreshConfiguration";


export default class implements VintedBotCommand {
    name = "disablesearch";
    description = "Disable search";
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
        const search = client.VintedApi.configuration.searches.find((search) => search.name.toLowerCase() == name.toLowerCase());
        if(!search) return interaction.reply({content: ":x: | Not found"});
        search.disabled = !search.disabled;
        fs.writeFileSync("config.json", JSON.stringify(search, null, 4));
        refreshConfiguration(client.VintedApi);
        interaction.reply({content: `:white_check_mark: | Done !\n${search.name} is now ${search.disabled ? "enabled" : "disabled"}.`})
    }
}
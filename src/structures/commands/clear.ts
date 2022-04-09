import { CommandInteraction, CacheType, TextChannel } from "discord.js";
import { ApplicationCommandOptionType, ApplicationCommandTypes, VintedBotCommand } from "../ApplicationCommandInterface";
import { DiscordClient } from "../DiscordClient";


export default class implements VintedBotCommand {
    name = "clear";
    description = "Clear the channel";
    type = ApplicationCommandTypes.CHAT_INPUT
    options = [{
        name: "number",
        description: "Number of messages to delete",
        required: true,
        type: ApplicationCommandOptionType.INTEGER
    }]

    execute = async(client: DiscordClient, interaction: CommandInteraction<CacheType>):Promise<void> => {
        const amount = interaction.options.getInteger("number", true);
        if(!amount) return interaction.reply({content: ":x: invalid amount"}).catch(console.warn);
        if(interaction.channel?.isText() && interaction.inGuild()) {
            (interaction.channel as TextChannel).bulkDelete(amount, true);
        }
        interaction.reply({content: ":white_check_mark: | Cleared channel !"})
    }
}
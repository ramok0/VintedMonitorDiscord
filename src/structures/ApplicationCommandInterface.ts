import { Awaitable, CommandInteraction } from "discord.js"
import { DiscordClient } from "./DiscordClient"

export interface VintedBotCommand {
    id?: number,
    type: ApplicationCommandTypes,
    name: string,
    descripton: string,
    options?: ApplicationCommandOption,
    execute: (client: DiscordClient, interaction: CommandInteraction) => Promise<void>
}

interface ApplicationCommandOption {
    type: ApplicationCommandOptionType,
    name: string,
    descritpion: string,
    required?: boolean,
    choices?: ApplicationCommandOptionChoice[],
    options?: ApplicationCommandOption[],
    min_value?: number,
    max_value?: number,
    autocomplete?: boolean
}

interface ApplicationCommandOptionChoice {
    name: string,
    value: string
}

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONNABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11
}

export enum ApplicationCommandTypes {
    CHAT_INPUT =1,
    USER = 2,
    MESSAGE = 3
}
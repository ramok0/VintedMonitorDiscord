import { MessageComponent } from "./MessageComponent";

export interface Message {
    content?: string,
    embeds: MessageEmbed[],
    components: MessageComponent[]
}
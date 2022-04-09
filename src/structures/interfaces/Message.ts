export interface Message {
    content?: string,
    embeds: MessageEmbed[],
    components: MessageComponent[]
}



export interface MessageComponent {
    type: Types,
    components?: MessageComponent[] | ButtonComponent[]
}

export enum Types {
    ACTION_R0W = 1,
    BUTTON = 2,
    SELECT_MENU = 3,
    TEXT_INPUT = 4
}

export interface MessageEmbed {
    title?: string,
    color?: number,
    fields?: MessageEmbedFields[],
    footer?: MessageEmbedFooter,
    timestamp?: string,
    image?: MessageEmbedImage,

    url: string,
}


interface MessageEmbedImage {
    url: string
}

interface MessageEmbedFooter {
    text: string;
}

interface MessageEmbedFields {
    name: string,
    value: string,
    inline?: boolean
}

export interface ButtonComponent {
    type: Types,
    style: ButtonStyles,
    label?: string,
    emoji?: EmojiStructure,
    custom_id?: string,
    url?: string,
    disabled?: string
}

interface EmojiStructure {
    id?: string,
    name?: string
}

export enum ButtonStyles {
    BLUE = 1,
    GREY = 2,
    GREEN = 3,
    DANGER = 4,
    LINK = 5
}
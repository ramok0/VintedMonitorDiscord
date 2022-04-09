interface MessageEmbed {
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
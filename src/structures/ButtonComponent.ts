import { Types } from "./MessageComponent";

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
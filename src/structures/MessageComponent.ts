import { ButtonComponent } from "./ButtonComponent";

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
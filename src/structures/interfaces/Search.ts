interface ItemToSearch {
    name: string,
    channel_id: string,
    queries: string[],
    min_price: number,
    max_price: number,
    sizeInLetters: boolean,
    disabled: boolean
}
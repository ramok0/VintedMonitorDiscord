interface MonitorItemFullInfo {
    id: number,
    title: string,
    description: string,
    brand: string,
    size: string,
    price: string,
    photos: string[],
    url: string,
    user: {
        id: number,
        login: string,
        feedback_reputation: string,
        created_at: Date,
        last_loged_on: Date,
        country_code: string,
        total_items_count: number
    },
    created_at: string,
    etat: string
}
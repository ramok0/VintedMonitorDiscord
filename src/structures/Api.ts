import { PreviewItemApiResponse, PreviewItem } from "./PreviewItem";
import { Rest } from "./Rest";
import { Message } from "./Message";
import { Types } from "./MessageComponent";
import { ButtonStyles } from "./ButtonComponent";
import { UnparsedCompleteInfos } from "./UnparsedCompleteInfos";

const wait = require("util").promisify(setTimeout);

export class Api {
    private configuration:Configuration;
    private rest:Rest;
    private trashBin:number[];
    constructor(settings:Configuration) {
        this.configuration = settings;
        this.rest = new Rest(this);
        this.trashBin = [];
    }

    public async fetchCompleteInfos(id:string):Promise<CompleteInformations> {
        const cookie = await this.getCookie();
        const response = await this.rest.get(`https://vinted.fr/api/v2/items/${id}`, {
            "Cookie": "_vinted_fr_session=" + cookie
        });
        if(!response) {
            throw new Error("http error");
        }
        const data:UnparsedCompleteInfos = response.data;
        const parsedData:CompleteInformations = {
            id: data.item.id,
            title: data.item.title,
            description: data.item.description,
            brand: data.item.brand,
            size: data.item.size,
            price: data.item.price,
            url: data.item.url,
            photos: data.item.photos.map((photo) => photo.url),
            user: {
                id: data.item.user.id,
                login: data.item.user.login,
                feedback_reputation: data.item.user.feedback_reputation,
                created_at: new Date(data.item.user.created_at),
                last_loged_on: new Date(data.item.user.last_loged_on_ts),
                country_code: data.item.user.country_code,
                total_items_count: data.item.user.total_items_count
            },
            created_at: data.item.created_at,
            etat: data.item.status
        }

        return parsedData;
    }

    public async executeQueries() {
        for await(const search of this.configuration.searches) {
            console.log("Searching for : " + search.name);
            let result:PreviewItem[] = [];
            for await(const query of search.queries) {
                const url = `https://www.vinted.fr/api/v2/catalog/items?${query}&per_page=100`;
                const data = await this.executeQuery(url, search.min_price, search.max_price, search.sizeInLetters);
                result = result.concat(data); 
            }
            console.log("Got " + result.length + " results")
            const messages:Message[] = result.map((vintedItem:PreviewItem) => {
                return {
                    content: "",
                    embeds: [{

                            "url": vintedItem.url,
                        
                        "title": vintedItem.title,
                        "color": this.configuration.embed_color,
                        fields: [{
                         "name": "💲 Prix",
                         "value": '```fix\n' + vintedItem.price + " " + vintedItem.currency + '```',
                         "inline": true
                        }, {
                         "name": "🗼 Taille",
                         "value": `\`\`\`fix
${vintedItem.size_title}\`\`\``,
                         "inline": true
                        }, {
                         "name": "👚 Marque",
                         "value": `\`\`\`fix
${vintedItem.brand_title}\`\`\``,
                         "inline": true
                        },
                        {
                          "name": "Profil de l'utilisateur",
                          "value": "`" + vintedItem.user.login + "`" + " [Cliquez ici](" + vintedItem.user.profile_url + ")"
                        }],
                        "footer": {
                            "text": "Made by Ramok (github.com/RamokTVL), if you paid this you got scammed."
                        },
                        "timestamp": new Date().toISOString(),
                        "image": {
                            "url": vintedItem.photo?.url ?? ""
                        }
                    }],
                 components: [{
                    type: Types.ACTION_R0W,
                    components: [{
                        type: Types.BUTTON,
                        style: ButtonStyles.GREEN,
                        label: "Plus d'informations",
                       emoji: {
                           id: null,
                           name: "⁉️"
                       },
                        custom_id: vintedItem.id
                    }]
                }]
                }
            });
            
            for await(var message of messages) {
                const response = await this.rest.post(`https://discord.com/api/v9/channels/${search.channel_id}/messages`, message, `Bot ${this.configuration.discord_token}`);
                if(response.headers["x-ratelimit-remaining"] == '0') {
                    await wait(parseFloat(response.headers["x-ratelimit-reset-after"])*1000);
                }
            }


        }
    }

    private async executeQuery(url:string, min_price: number, max_price: number, sizeInLetters:boolean):Promise<PreviewItem[]> {
        const cookie = await this.getCookie();
        const response = await this.rest.get(url, {
            "Cookie": "_vinted_fr_session=" + cookie
        });
        if(!response) {
            throw new Error("http error");
        }
         const data:PreviewItemApiResponse = response.data;
         let items = data.items.filter((item) => {
             if(this.trashBin.includes(item.id)) return false;
             this.trashBin.push(item.id);
            const price = parseFloat(item.price) || 0;
            return price >= min_price && price <= max_price;
         });

         if(sizeInLetters == true) {
             items = items.filter((item) => !/[^a-zA-Z]/.test(item.size_title));
         }
        return items.slice(0, 15);
    } 
    
    private async getCookie():Promise<string> {
        const response = await this.rest.get("https://vinted.fr", {});
        if(!response) {
            throw new Error("http error");
        }
        const headers = response.headers["set-cookie"]?.filter((header) => header.startsWith("_vinted_fr_session"));
        if(!headers) throw new Error("Headers is undefined");
        if(headers.length == 0) {
            throw new Error("No headers found");
        }
        const value = headers[0].substring("_vinted_fr_session=".length).split(";")[0];

        return value;
    }
}
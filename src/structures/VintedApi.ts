import { PreviewItemApiResponse, PreviewItem } from "./api/PreviewItem";
import { Rest } from "./Rest";
import { Message, Types, ButtonStyles, MessageEmbed } from "./interfaces/Message";
import { UnparsedCompleteInfos } from "./api/ItemInfo";
import { PreviewItemToEmbed } from "./functions/PreviewItemToEmbed";
import { Logger } from "./Logger";
import { checkConfigIntegrity } from "./functions/checkConfigIntregrity";


const wait = require("util").promisify(setTimeout);

export class VintedApi {
    public configuration:Configuration;
    private rest:Rest;
    private trashBin:number[];
    public logger:Logger;
    constructor(settings:Configuration) {
        this.configuration = settings;
        this.rest = new Rest(this);
        this.trashBin = [];
        this.logger = new Logger(this);
        this.logger.log("Created VintedApi successfully", "OK");
        if(!checkConfigIntegrity(this.configuration, this.logger)) {
            
            process.exit(1);
        }
    }

    public async fetchCompleteInfos(id:string):Promise<MonitorItemFullInfo> {
        this.logger.log(`Fetching complete infos for id : ${id}`, "INFO");
        const cookie = await this.getCookie();
        const response = await this.rest.request(`https://vinted.fr/api/v2/items/${id}`, "GET", {
            "Cookie": "_vinted_fr_session=" + cookie
        });
        if(!response) {
            throw new Error("http error");
        }
        const data:UnparsedCompleteInfos = response.data;
        const parsedData:MonitorItemFullInfo = {
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
        this.logger.log(`Complete infos fetched for id : ${id}`, "OK");
        return parsedData;
    }

    private async getContent(queries:string[], item:ItemToSearch) {
        this.logger.log(`Getting content for item : ${item.name}`, "INFO");
        let result:PreviewItem[] = [];
        for (var query of queries) {
            const url = `https://www.vinted.fr/api/v2/catalog/items?${query.replace(/ /g, "+")}&per_page=50`;
            const data = await this.executeQuery(url, item.min_price, item.max_price, item.sizeInLetters);
            result = result.concat(data); 
        }
        this.logger.log(`Got content for item : ${item.name}`, "OK");
        return result;
    }

    public async executeQueries() {
        this.logger.log(`Executing every queries`, "INFO");
        this.configuration.items.filter(item => item.disabled == false).forEach(async(item) => {
            const result = await this.getContent(item.queries, item);
            this.logger.log(`Got ${result.length} items for ${item.name}`, "OK");
            const messages:Message[] = result.map((vintedItem:PreviewItem) => {
                return {
                    content: "",
                    embeds: [PreviewItemToEmbed(vintedItem, this.configuration).toJSON() as MessageEmbed],
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
            
            this.logger.log(`Sending messages`, "INFO");
            for await(var message of messages) {
                const response = await this.rest.request(`https://discord.com/api/v9/channels/${item.channel_id}/messages`, "POST", {
                    "Authorization": `Bot ${this.configuration.discord_token}`,
                    "Content-Type": "application/json"
                }, false, message);

                if(response.headers["x-ratelimit-remaining"] == '0') {
                    const ms = parseFloat(response.headers["x-ratelimit-reset-after"])*1000;
                    this.logger.log(`Ratelimited by Discord, retring in ${ms}ms`, "INFO");
                    await wait(ms);
                }
            }
        });
    }

    private async executeQuery(url:string, min_price: number, max_price: number, sizeInLetters:boolean):Promise<PreviewItem[]> {
        const cookie = await this.getCookie();
        const response = await this.rest.request(url, "GET", {
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
        this.logger.log("Getting cookie for https://vinted.fr", "INFO");
        const response = await this.rest.request("https://vinted.fr", "GET");
        if(!response) {
            throw new Error("http error");
        }
        const headers = response.headers["set-cookie"]?.filter((header) => header.startsWith("_vinted_fr_session"));
        if(!headers) throw new Error("Headers is undefined");
        if(headers.length == 0) {
            throw new Error("No headers found");
        }
        const value = headers[0].substring("_vinted_fr_session=".length).split(";")[0];
        this.logger.log("Got cookie for https://vinted.fr", "OK");
        return value;
    }
}
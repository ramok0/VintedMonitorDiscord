import axios, { AxiosRequestHeaders } from "axios";
import { AxiosResponse } from "axios";
import {VintedApi} from "./VintedApi";
import { Base } from "./Base";
import { Message } from "./interfaces/Message";
import randomUseragent from 'random-useragent'

export class Rest extends Base {
    constructor(api:VintedApi) {
        super(api);
    }

    async get(url:string, headers:AxiosRequestHeaders) {
        var ua = randomUseragent.getRandom(function (ua) {
            return ua.browserName === 'Firefox';
        });
        headers["User-Agent"] = ua ?? ""; 
        try {
            const response = await axios.get(url, {
                headers
            })
    
            return this.handleResponse(response);
        }catch(e) {
            console.log(e);
        }
    }

    async post(url:string, body:string|Message, token:string) {
        const response = await axios.post(url, body, {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        });

        return this.handleResponse(response);
    }

    private handleResponse(response:AxiosResponse) {
        if(response.status.toString().startsWith("2")) {
            console.log(`Request to ${new URL(response.config.url ?? "").hostname} ended with status code ${response.status}`);
        }

        return response;
    }
}
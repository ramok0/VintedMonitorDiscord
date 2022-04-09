import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";
import { AxiosResponse } from "axios";
import {VintedApi} from "./VintedApi";
import { Base } from "./Base";
import randomUseragent from 'random-useragent'

export class Rest extends Base {
    constructor(api:VintedApi) {
        super(api);
    }

    async request(url:string, method:Method, headers:AxiosRequestHeaders = {}, randomUa: boolean = true, body:any|null = null) {
        if(randomUa == true) {
            var ua = randomUseragent.getRandom(function (ua) {return ua.browserName === 'Firefox' || ua.browserName == "Chrome";});
            headers["User-Agent"] = ua ?? ""; 
        }

        const axiosRequest:AxiosRequestConfig<any> = {
            method,
            url,
            headers,
        };

        if(body != null) {
            axiosRequest["data"] = body;
        }

        const response = await axios(axiosRequest);
        return this.handleResponse(response);
    }

    private handleResponse(response:AxiosResponse) {
        if(response.status.toString().startsWith("2")) {
            console.log(`Request to ${new URL(response.config.url ?? "").hostname} ended with status code ${response.status}`);
        }

        return response;
    }
}
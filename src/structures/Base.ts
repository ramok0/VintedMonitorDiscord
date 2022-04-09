import { VintedApi } from "./VintedApi";
export class Base {
    private api:VintedApi;
    constructor(api:VintedApi) {
        this.api = api;
    }
}
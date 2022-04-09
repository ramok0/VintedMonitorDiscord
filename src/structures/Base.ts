import { VintedApi } from "./VintedApi";
export class Base {
    public VintedApi:VintedApi;
    constructor(api:VintedApi) {
        this.VintedApi = api;
    }
}
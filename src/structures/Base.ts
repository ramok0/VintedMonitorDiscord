import { Api } from "./Api";
export class Base {
    private api:Api;
    constructor(api:Api) {
        this.api = api;
    }
}
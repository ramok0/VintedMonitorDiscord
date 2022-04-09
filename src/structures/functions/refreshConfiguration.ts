import { VintedApi } from "../VintedApi";

export function refreshConfiguration(vintedClient:VintedApi) {
    delete require.cache[require.resolve("../../config.json")];
    const config:Configuration = require("../../config.json");
    vintedClient.configuration = config;
}
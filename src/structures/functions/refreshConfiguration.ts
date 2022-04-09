import { VintedApi } from "../VintedApi";

export function refreshConfiguration(vintedClient:VintedApi) {
    vintedClient.logger.log("Refreshing configuration", "INFO");
    delete require.cache[require.resolve("../../config.json")];
    vintedClient.logger.log("Deleted require cache for config.json", "INFO");
    const config:Configuration = require("../../config.json");
    vintedClient.configuration = config;
    vintedClient.logger.log("Updated configuration", "OK");
}
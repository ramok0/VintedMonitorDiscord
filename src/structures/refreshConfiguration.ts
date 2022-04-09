import { Api } from "./Api";

function refreshConfiguration(vintedClient:Api) {
    delete require.cache[require.resolve("../../config.json")];
    const config:Configuration = require("../../config.json");
    vintedClient.configuration = config;
}
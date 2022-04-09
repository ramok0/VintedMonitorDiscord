const axios = require("axios");
const fs = require("fs");

(async() => {
    if(!fs.existsSync("config.json")) return console.error("Config.json not found ! Please run configurator before starting this file");
    const config = require("../config.json");
    const {server_id, discord_token} = config;
    const data = {
        name: "executequeries",
        description: "Execute every queries"
    }
    const user_id = Buffer.from(discord_token.split(".")[0], "base64").toString("utf-8");

    const response = await axios.post(`https://discord.com/api/v8/applications/${user_id}/guilds/${server_id}/commands`, data, {
        headers: {
            "Authorization": `Bot ${discord_token}`,
            "Content-Type": "application/json"
        },
        validateStatus: () => true,
    });

    console.log(response.status)
})();
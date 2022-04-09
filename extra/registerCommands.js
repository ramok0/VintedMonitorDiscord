const axios = require("axios");
const fs = require("fs");

(async() => {
    if(!fs.existsSync("config.json")) return console.error("Config.json not found ! Please run configurator before starting this file");
    const config = require("../config.json");
    const {server_id, discord_token} = config;
    let files = fs.readdirSync("dist/structures/commands", {withFileTypes: true}).filter((a) => a.isFile() && a.name.endsWith(".js")).map(a => a.name);
    files = files.map((file) => {
        const {default:cmd} = require("../dist/structures/commands/" + file);
        const command = new cmd();
        return {
            name: command.name,
            description: command.description,
            type: command.type
        }
    });


    const user_id = Buffer.from(discord_token.split(".")[0], "base64").toString("utf-8");

    const response = await axios.put(`https://discord.com/api/v8/applications/${user_id}/guilds/${server_id}/commands`, files, {
        headers: {
            "Authorization": `Bot ${discord_token}`,
            "Content-Type": "application/json"
        },
        validateStatus: () => true,
    });

    console.log(response.status)
})();
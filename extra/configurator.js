const fs = require("fs");
const config = require("../config.sample.json");
const readline = require("readline");
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const axios = require("axios");
const ms = require("ms");
(async() => {
    console.log("Welcome to the VintedMonitorDiscord configurator");
    const token = await question("Whats your discord bot token ? ");
    const isValid = await checkToken(token);
    if(!isValid) return console.log("Invalid Token.");
    config.discord_token = token;
    const interval = await question("Interval of refreshing (5min recommanded) : ");
    const msInterval = ms(interval);
    if(!msInterval) return console.log("Invalid interval");
    config.refreshInterval = msInterval;
    const fetchAtStartStr = await question("Do you wanna fetch items at startup ? (y/n) : ");
    const fetchAtStartStrLower = fetchAtStartStr.toLowerCase();
    if(fetchAtStartStrLower == "y") {
        config.fetch_at_start = true;
    } else if(fetchAtStartStrLower == "n") {
        config.fetch_at_start = false;
    } else {
        return console.log("Invalid input");
    }

    const serverId = await question("Server id : ");
    config.server_id = serverId;

    const userId = await question("Your user Id : ");
    config.user_id = userId;

    const userIdLocked = await question("User Id Locked (y/n) : ");
    switch(userIdLocked.toLowerCase()) {
        case "y":
            config.user_id_locked = true;
            break;
        case "n":
            config.user_id_locked = false;
            break;
        default:
            return console.log("Invalid input");
            break;
    }

    const logsInConsole = await question("Do you wanna have the logs in the console (y/n) : ");
    switch(logsInConsole.toLowerCase()) {
        case "y":
            config.logs_in_console = true;
            break;
        case "n":
            config.logs_in_console = false;
            break;
        default:
            return console.log("Invalid input");
            break;
    }

    fs.writeFile("config.json", JSON.stringify(config, null, 4), () => {
        console.log("Config file written successfully !\nNow, you have to complete search queries in the config.json file and then start the bot!");
        process.exit(0);
    });
})();

async function checkToken(token) {
    try {
        const response = await axios.get("https://discord.com/api/v9/users/@me", {
            headers: {
                "Authorization": "Bot " + token
            }
        });

        if(response.status == 200) {
            return true;
        } else return false;
    } catch(e) {
        console.log(e);
        return false;
    }
}

function question(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        })
    });
}
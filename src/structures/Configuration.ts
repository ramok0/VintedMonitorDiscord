import { Logger } from "./Logger"
import {existsSync, fstat, readFileSync, writeFileSync} from "fs";

interface IConfiguration {
    items: ItemToSearch[],
    discord_token: string | null,
    embed_color: number,
    use_discord_bot: boolean,
    fetch_at_start: boolean,
    refreshInterval: number,
    server_id: string,
    user_id: string,
    user_id_locked: boolean,
    logs_in_console: boolean
}

export class Configuration implements IConfiguration {
    items: ItemToSearch[]
    discord_token: string | null
    embed_color: number
    use_discord_bot: boolean
    fetch_at_start: boolean
    refreshInterval: number
    server_id: string
    user_id: string
    user_id_locked: boolean
    logs_in_console: boolean
    private logger:Logger|null;
    public minimal:boolean;
    constructor(logger:Logger|null = null) {
        this.items = [];
        this.discord_token = null;
        this.embed_color = 0;
        this.use_discord_bot = false;
        this.fetch_at_start = false;
        this.refreshInterval = 1 * 60 * 5;
        this.server_id = '';
        this.user_id = '';
        this.user_id_locked = true;
        this.logs_in_console = true;
        if(logger) {
            this.logger = logger;
            this.loadConfiguration();
            this.minimal = false;
        } else {
            this.logger = null;
            this.minimal = true;
            this.loadMinimalConfiguration();
        }

    }

    private replaceValues(old:IConfiguration) {
        this.discord_token = old.discord_token;
        this.embed_color = old.embed_color;
        this.logs_in_console = old.logs_in_console;
        this.user_id_locked = old.user_id_locked;
        this.user_id = old.user_id;
        this.server_id = old.server_id;
        this.use_discord_bot = old.use_discord_bot;
        this.items = old.items;
        this.refreshInterval = old.refreshInterval;
        this.fetch_at_start = old.fetch_at_start;
    }

    saveConfiguration() {
        if(!this.logger) return console.log("The logger is required to execute this function");
        var stringifyed = JSON.stringify(this);
        writeFileSync("configtest.json", stringifyed);
        this.logger.log("Saved config", "OK");
    }

    loadMinimalConfiguration() {
        if(!existsSync("config.json")) {
            console.log("The config file does not exists");
            return null;
        }  else {
            const configRaw = readFileSync("config.json").toString();
            try {
                JSON.parse(configRaw);
            } catch(e) {
                console.log("Unexcepted error while parsing json config");
                return null;
            }

            const config:IConfiguration = JSON.parse(configRaw);
            this.replaceValues(config);
        }
    }

    loadConfiguration() {
        if(this.logger == null) return console.log("No logger");
        if(!existsSync("config.json")) {
            this.logger.log("The config file does not exists", "ERROR");
            return null;
        } else {
            const configRaw = readFileSync("config.json").toString();
            try {
                JSON.parse(configRaw);
            } catch(e) {
                this.logger.log("Unexcepted error while parsing json config", "ERROR");
                return null;
            }

            const config:IConfiguration = JSON.parse(configRaw);
            if(this.checkIntegrity(config) == false) {
                this.logger.log("The config could not load, the config is malformated", "ERROR");
                return null;
            }

            this.replaceValues(config);
            this.logger.log("The config has been loaded successfully", "OK");

        }
    }

    checkIntegrity(config:IConfiguration = this) {
        if(!this.logger) return console.log("This function requires logger");
        const tokenRegex = /[A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g;
        if(config.discord_token == null) {
            this.logger.log("The token is invalid", "ERROR");
            return false;
        }
        if(!tokenRegex.test(config.discord_token)) {
            this.logger.log("The token is invalid", "ERROR");
            return false;
        }
    
        if(isNaN(config.embed_color)) {
            this.logger.log("The embed color is incorrect", "WARNING");
        }
    
        if(isNaN(config.refreshInterval)) {
            this.logger.log("The refresh interval is not a number", "ERROR");
            return false;
        }
    
        if(typeof(config.use_discord_bot) !== "boolean") {
            this.logger.log("Use Discord Bot is not a boolean", "ERROR");
            return false;
        }
    
        if(typeof(config.fetch_at_start) !== "boolean") {
            this.logger.log("Fetch at start is not a boolean", "ERROR");
            return false;
        }
    
        if(typeof(config.user_id_locked) !== "boolean") {
            this.logger.log("User id locked is not a boolean", "ERROR");
            return false;
        }
    
        if(typeof(config.logs_in_console) !== "boolean") {
            this.logger.log("Logs in console is not a boolean", "ERROR");
            return false;
        }
    
        if(typeof(config.server_id) !== "string" || config.server_id.length !== 18) {
            this.logger.log("Server id is not valid", "ERROR");
            return false;
        }
    
        if(typeof(config.user_id) !== "string" || config.user_id.length !== 18) {
            this.logger.log("User id is invalid", "ERROR");
            return false;
        }
    
        this.logger.log("Checked this intregrity successfully", "OK");
    }
}
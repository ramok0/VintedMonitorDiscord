import { Logger } from "../Logger";

export function checkConfigIntegrity(config:Configuration, logger:Logger):boolean {
    const tokenRegex = /[A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g;
    if(!tokenRegex.test(config.discord_token)) {
        logger.log("The token is invalid", "ERROR");
        return false;
    }

    if(isNaN(config.embed_color)) {
        logger.log("The embed color is incorrect", "WARNING");
    }

    if(isNaN(config.refreshInterval)) {
        logger.log("The refresh interval is not a number", "ERROR");
        return false;
    }

    if(typeof(config.use_discord_bot) !== "boolean") {
        logger.log("Use Discord Bot is not a boolean", "ERROR");
        return false;
    }

    if(typeof(config.fetch_at_start) !== "boolean") {
        logger.log("Fetch at start is not a boolean", "ERROR");
        return false;
    }

    if(typeof(config.user_id_locked) !== "boolean") {
        logger.log("User id locked is not a boolean", "ERROR");
        return false;
    }

    if(typeof(config.logs_in_console) !== "boolean") {
        logger.log("Logs in console is not a boolean", "ERROR");
        return false;
    }

    if(typeof(config.server_id) !== "string" || config.server_id.length !== 18) {
        logger.log("Server id is not valid", "ERROR");
        return false;
    }

    if(typeof(config.user_id) !== "string" || config.user_id.length !== 18) {
        logger.log("User id is invalid", "ERROR");
        return false;
    }

    logger.log("Checked config intregrity successfully", "OK");
    return true;
}
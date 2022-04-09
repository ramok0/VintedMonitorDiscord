import { Base } from "./Base";
import { VintedApi } from "./VintedApi";
import fs from "fs";
import { ConsoleColors, writeColor } from "./functions/console/writeColor";


export class Logger extends Base {
    private stream:fs.WriteStream | null;
    constructor(vintedClient:VintedApi) {
        super(vintedClient);
        this.stream = null;
        this.init();
    }

    init() {
        const start = `# VintedMonitorDiscord logger initialisation - `;
        if(!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
  
        if(fs.existsSync("logs/latest.log")) {
            const text = fs.readFileSync("logs/latest.log").toString().split("\n");
            if(text.length == 0) fs.unlinkSync("logs/latest.log");
            const firstLine = text[0];
            if(firstLine.includes(start)) {
                const date = firstLine.substring(firstLine.indexOf(start) + start.length).trim();
                const writableDate = date.replace(/\/|\:| /g, "-");
                fs.renameSync("logs/latest.log", "logs/" + writableDate + ".log");
            } else {
                fs.unlinkSync("logs/latest.log");
            }
        }

        const stream = fs.createWriteStream("logs/latest.log", {encoding: "utf-8"});
        this.stream = stream;
        
        this.log(`${start}${this.getFullDate()}`, "UNKNOWN");
    }

    log(text:string, type:LogType) {
        let color:ConsoleColors = ConsoleColors.MAX;
        let toWriteInFile = '';
        switch(type) {
            case "OK":
                color = ConsoleColors.Green;
                toWriteInFile += "[ OK ] ";
                break;
            case "INFO":
                color = ConsoleColors.Blue;
                toWriteInFile += "[ INFO ] ";
                break;
            case "WARNING":
                color = ConsoleColors.Orange;
                toWriteInFile += "[ WARNING ] ";
                break;
            case "ERROR":
                color = ConsoleColors.Red;
                toWriteInFile += "[ ERROR ] ";
                break;
            default:
                toWriteInFile += "[ UNKNOWN ] "
                break;
        }
        if(this.VintedApi.configuration.logs_in_console == true) {
            writeColor(text, color, type);
        }

        toWriteInFile += this.getMinifiedDate();
        toWriteInFile += text;
        if(!this.stream) return;
        this.stream.write(toWriteInFile + '\n');
    }

    private getFullDate():string {
        const originalDate = new Date();
        const date = `${originalDate.getFullYear()}/${originalDate.getDate()}/${originalDate.getMonth()+1} ${originalDate.getHours()}:${originalDate.getMinutes()}:${originalDate.getSeconds()}`;
        return date;
    }

    private getMinifiedDate():string {
        const originalDate = new Date();
        const date = `[ ${originalDate.getHours()}:${originalDate.getMinutes()}:${originalDate.getSeconds()} ] `;
        return date;
    }
}

export type LogType = "OK" | "INFO" | "WARNING" | "ERROR" | "UNKNOWN";
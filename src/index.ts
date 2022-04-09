
const config:Configuration = require("../config.json");
import { ButtonInteraction, Interaction, MessageEmbed } from "discord.js"
import { setInterval } from "timers";
import { Api } from "./structures/Api";
import { DiscordClient } from "./structures/DiscordClient";
import { strToBigText } from "./structures/strToBigText";

if(config.use_discord_bot) {
    const client = new DiscordClient(config);

    client.on("ready", () => {
        console.log("Ready");
        if(config.fetch_at_start == true) {
            client.VintedApi.executeQueries();
        }

        setInterval(() => {
            client.VintedApi.executeQueries();
        }, config.refreshInterval)
    });
    
    client.on("interactionCreate", async(interaction:Interaction) => {
        if(interaction.isButton()) {
            interaction as ButtonInteraction;
            const completeInfos = await client.VintedApi.fetchCompleteInfos(interaction.customId);
            const embed = new MessageEmbed();
            embed.setColor(config.embed_color);
            embed.setURL(completeInfos.url);
            embed.setTitle(completeInfos.title);
            embed.setDescription(`\`${completeInfos.description}\``);
            embed.addField("💲 Prix", strToBigText(completeInfos.price), true);
            embed.addField("🗼 Taille", strToBigText(completeInfos.size), true);
            embed.addField("👚 Marque", strToBigText(completeInfos.brand), true);
            embed.addField("🪥 Etat", strToBigText(completeInfos.etat), false);
            embed.addField("😊 Auteur", strToBigText(completeInfos.user.login), true);
            embed.addField("➕ Indice de confiance", strToBigText(String(parseFloat(completeInfos.user.feedback_reputation)*100) + "% de satisfaits"), true);
            embed.addField("🔟 Nombre d'annonces postés", strToBigText(String(completeInfos.user.total_items_count)), true);
            embed.addField("⏱️ Compte crée le", strToBigText(String(completeInfos.user.created_at.toLocaleDateString())), true);
            embed.addField("⏱️ Dernière activité du compte", strToBigText(String(completeInfos.user.last_loged_on.toLocaleDateString())), true);
            embed.addField("⏱️ Annonce posté le", strToBigText(String(completeInfos.created_at)), true);
            embed.setImage(completeInfos.photos[0] ?? "");
            embed.setTimestamp();
            embed.setFooter({
                text: "Made by Ramok (github.com/RamokTVL), if you paid this you got scammed"
            });
            interaction.reply({
                embeds:[embed],
                ephemeral: true
            })
        }
    });
    
    client.login(config.discord_token);
} else {
    const api = new Api(config);
    setInterval(() => {
        api.executeQueries();
    }, config.refreshInterval);
}

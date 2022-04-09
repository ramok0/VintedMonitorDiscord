import { ButtonInteraction, CommandInteraction, Interaction, MessageEmbed } from "discord.js";
import { VintedBotCommand } from "./ApplicationCommandInterface";
import { DiscordClient } from "./DiscordClient";
import { strToBigText } from "./strToBigText";

export function handleInteractions(client:DiscordClient) {
    client.on("interactionCreate", async(interaction:Interaction) => {
        if(interaction.isButton()) {
            handleButtonInteraction(client, interaction);
        } else if(interaction.isCommand()) {
            handleCommandInteractions(client, interaction);
        }
    });
}

async function handleCommandInteractions(client:DiscordClient, interaction:CommandInteraction) {
    const commandName = interaction.commandName;
    //a real command handler is useless rn
    if((interaction.user.id !== client.VintedApi.configuration.user_id) && client.VintedApi.configuration.user_id_locked == true) return;
    if(client.commands.has(commandName)) {
        const command:VintedBotCommand|null = client.commands.get(commandName) ?? null;
        if(!command) return;
        command.execute(client, interaction);
    }
}

async function handleButtonInteraction(client:DiscordClient, interaction:ButtonInteraction) {
    const completeInfos = await client.VintedApi.fetchCompleteInfos(interaction.customId);
    const config = client.VintedApi.configuration;
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
    });
}
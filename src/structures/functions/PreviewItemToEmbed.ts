import { MessageEmbed } from "discord.js";
import { PreviewItem } from "../api/PreviewItem";

export function PreviewItemToEmbed(item:PreviewItem, config:Configuration):MessageEmbed {
    const embed = new MessageEmbed();
    embed.setURL(item.url);
    embed.setTitle(item.title);
    embed.setColor(config.embed_color);
    embed.addField("💲 Prix",  '```fix\n' + item.price + " " + item.currency + '```', true);
    embed.addField("🗼 Taille",  '```fix\n' + item.size_title + '```', true);
    embed.addField("👚 Marque",  '```fix\n' + item.brand_title + '```', true);
    embed.addField("Profil de l'utilisateur",  "`" + item.user.login + "`" + " [Cliquez ici](" + item.user.profile_url + ")", true);
    embed.setFooter({
        text: "Made by Ramok (github.com/RamokTVL), if you paid this you got scammed."
    });
    embed.setTimestamp();
    embed.setImage(item.photo?.url ?? "");
    return embed;
}
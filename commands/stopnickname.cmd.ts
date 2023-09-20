import {SlashCommandBuilder} from "discord.js";
import {removeNickname} from "../db/db";

export ={
    data:new SlashCommandBuilder()
        .setName("stopnickname")
        .setDescription("Disable your auto nickname for this server"),
    async execute(interaction) {
        await removeNickname(interaction.user.id,interaction.guildId)
        try {
            await interaction.user.setNickname(null)//reset nickname
        } catch (e){
            // this probably only happens if we dont have perms
        }
        interaction.reply({
            content:`Nickname removed.`,
            ephemeral:true
        })
    }
}
import {SlashCommandBuilder} from "discord.js";
import {changeNickname} from "../db/db";
import {updateNickname} from "../nicknameService";


export = {
    data:new SlashCommandBuilder()
        .setName("nickname")
        .setDescription("Set a nickname that will be updated based on your hours in a game")
        .addStringOption( option => option
            .setName("steamid")
            .setDescription("Your SteamID")
            .setRequired(true)
        )
        .addStringOption( option => option
            .setName("appid")
            .setDescription("Steam appid of the game you want to use")
            .setRequired(true)
        )
        .addStringOption( option => option
            .setName("nickname")
            .setDescription("Format of the nickname you want, use %HOURS% to insert the hours into the name")
            .setRequired(true)
        ),
    async execute(interaction){
        if(!interaction.inGuild()) {
            interaction.reply("This can only be done in a server")
            return // exit early if the command isnt in a guild
        }
        const steamid = interaction.options.getString("steamid")
        const appid = interaction.options.getString("appid")
        const nickname = interaction.options.getString("nickname")

        try{
            await changeNickname(interaction.user.id, interaction.guildId,steamid,appid,nickname)
            await updateNickname(interaction.client, interaction.user.id,interaction.guildId)
            interaction.reply({
                content:`Nickname changed to ${nickname}`,
                ephemeral:true
            })
        } catch (e) {
            interaction.reply({
                content:`Error in changing nickname`,
                ephemeral:true
            })
        }
    }
}
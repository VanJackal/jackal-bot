import {SlashCommandBuilder} from "discord.js";
import {updateNickname} from "../nicknameService";
import {logger} from "../logger"

export ={
	data: new SlashCommandBuilder()
		.setName("updatenickname")
		.setDescription("Forces an update to your nickname"),
	async execute(interaction) {
		if(!interaction.inGuild()) return
		try{
			await updateNickname(interaction.client,interaction.user.id,interaction.guildId)
			interaction.reply({
				content:`Nickname updated.`,
				ephemeral:true
			})
		} catch (e) {
			interaction.reply({
				content:`Failed to update nickname.`,
				ephemeral:true
			})
			logger.error(e)
		}
	}
}
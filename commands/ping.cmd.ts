import {Interaction, SlashCommandBuilder} from "discord.js"

export = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Test Command"),
	async execute (interaction) {
		await interaction.reply(":3");
	}
}
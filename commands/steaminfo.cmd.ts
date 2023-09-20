import {EmbedBuilder, SlashCommandBuilder} from "discord.js";

import {getGames,topTen} from "../steamWrapper"

export = {
	data: new SlashCommandBuilder()
		.setName("steaminfo")
		.setDescription("Get your steam playtime info.")
		.addStringOption( option => option
			.setName("steamid")
			.setDescription("Your SteamID")
			.setRequired(true)
		),
	async execute(interaction) {
		const steamid = interaction.options.getString("steamid");
		const games = await topTen(steamid)
		console.log(games)
		const embed = new EmbedBuilder()
			.setTitle(`Top Playtime's for:`)
			.setDescription(`${steamid}`)
		let fields = []
		for (const game of games) {
			fields.push({
				name:`${game.appid}`,
				value:`${Math.round(game.playtime)}`,
				inline:true
			})
		}
		embed.addFields(...fields)
		interaction.reply({embeds:[embed]})
	}
}
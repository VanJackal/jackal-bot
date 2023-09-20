import * as path from "path"
import * as fs from "fs"
import {Client, Collection, EmbedBuilder, GatewayIntentBits} from 'discord.js';
import {logger} from "./logger"
import {init} from "./nicknameService";

const INTENTS = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions,
]

const client = new Client({intents:INTENTS})

client.on("ready", () => {
    logger.info(`Logged in as ${client.user.tag}`)
	init(client)
})


const commands = new Collection<string,{execute:Function}>();
const commandsPath = path.join(__dirname,'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cmd.js'))
for (const file of commandFiles) {
	const filePath = path.join(commandsPath,file)
	const command = require(filePath)
	commands.set(command.data.name,command);
}

client.on('interactionCreate', async (interaction) => {
	if(!interaction.isCommand()) return
	const command = commands.get(interaction.commandName)


	try{
		await command.execute(interaction)
	} catch (e) {
		logger.error(e)
		logger.error(JSON.stringify(e))
		const embed = new EmbedBuilder()
			.setColor("#ff0000")
			.addFields({name:"Error",value:`Error in command execution`})
			.setTimestamp()
	}
})

client.login(process.env.TOKEN)